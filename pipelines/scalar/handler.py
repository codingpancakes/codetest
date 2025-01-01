import os
import json
import base64
import boto3
import requests
import logging
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

# Initialize S3 client
s3 = boto3.client('s3')

SCALAR_API_URL = "https://api.bfl.ml/v1"
SCALAR_API_KEY = os.environ.get('SCALAR_API_KEY')
MAX_RETRIES = 30
RETRY_DELAY = 10  # seconds

def check_generation(event, context):
    """Check generation status"""
    try:
        gen_id = event['id']
        headers = {
            'X-Key': SCALAR_API_KEY
        }
        
        response = requests.get(
            f"{SCALAR_API_URL}/get_result?id={gen_id}",
            headers=headers
        )
        response.raise_for_status()
        result = response.json()
        
        # Map Scalar's "Ready" status to our "completed"
        if result['status'] == 'Ready' and 'result' in result and 'sample' in result['result']:
            result['status'] = 'completed'
        
        if result['status'] == 'completed' and 'images' in result['result']:
            # Save image to S3
            output_data = base64.b64decode(result['result']['images'][0])
            output_key = event['output_path']
            
            s3.put_object(
                Bucket=os.environ['S3_BUCKET'],
                Key=output_key,
                Body=output_data,
                ContentType='image/jpeg'
            )
            
            result['result_path'] = f"s3://{os.environ['S3_BUCKET']}/{output_key}"
            
        return result

    except Exception as e:
        logger.error(f"Error checking generation: {str(e)}")
        raise

def lambda_handler(event, context):
    """Start a new generation"""
    try:
        # Handle both direct invocation and API Gateway event
        if 'body' in event:
            if isinstance(event['body'], str):
                body = json.loads(event['body'])
            else:
                body = event['body']
        else:
            body = event

        # Extract parameters
        image_path = body['image_path']
        mask_path = body['mask_path']
        output_path = body.get('output_path', 'scalar_output')

        # Parse S3 paths
        image_bucket = image_path.split('/')[2]
        image_key = '/'.join(image_path.split('/')[3:])
        mask_bucket = mask_path.split('/')[2]
        mask_key = '/'.join(mask_path.split('/')[3:])

        # Get images from S3
        image_response = s3.get_object(Bucket=image_bucket, Key=image_key)
        mask_response = s3.get_object(Bucket=mask_bucket, Key=mask_key)

        # Convert to base64
        image_base64 = base64.b64encode(image_response['Body'].read()).decode('utf-8')
        mask_base64 = base64.b64encode(mask_response['Body'].read()).decode('utf-8')
        
        logger.info(f"Image length: {len(image_base64)}")
        logger.info(f"Mask length: {len(mask_base64)}")

        # Start generation
        headers = {
            'Content-Type': 'application/json',
            'X-Key': SCALAR_API_KEY
        }

        payload = {
            "image": image_base64,
            "mask": mask_base64,
            "prompt": body.get('prompt', 'enhance this area'),
            "steps": body.get('steps', 50),
            "prompt_upsampling": body.get('prompt_upsampling', False),
            "seed": body.get('seed', 1),
            "guidance": body.get('guidance', 60),
            "output_format": body.get('output_format', 'jpeg'),
            "safety_tolerance": body.get('safety_tolerance', 2)
        }

        logger.info("Starting generation")
        response = requests.post(
            f"{SCALAR_API_URL}/flux-pro-1.0-fill",
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        result = response.json()
        
        if 'id' not in result:
            raise Exception(f"No generation ID in response: {result}")
            
        gen_id = result['id']
        logger.info(f"Generation started with ID: {gen_id}")

        # Return generation ID and output path for the state machine
        return {
            "id": gen_id,
            "output_path": f"{output_path}/result.jpeg",
            "original_image": image_path,
            "mask_image": mask_path
        }

    except Exception as e:
        logger.error(f"Error starting generation: {str(e)}")
        raise

def poll_generation(event, context):
    try:
        for _ in range(MAX_RETRIES):
            gen_result = check_generation(event, context)
            logger.info(f"Generation status: {gen_result}")
            
            if gen_result['status'] == 'completed':
                response_body = {
                    "status": "success",
                    "result_path": gen_result['result_path'],
                    "original_image": event['original_image'],
                    "mask_image": event['mask_image']
                }
                
                if 'httpMethod' in event:
                    return {
                        "statusCode": 200,
                        "headers": {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*"
                        },
                        "body": json.dumps(response_body)
                    }
                return response_body
                
            elif gen_result['status'] in ['failed', 'error']:
                raise Exception(f"Generation failed: {gen_result}")
                
            time.sleep(RETRY_DELAY)
            
        raise Exception(f"Generation timed out after {MAX_RETRIES * RETRY_DELAY} seconds")

    except Exception as e:
        logger.error(f"Error polling generation: {str(e)}")
        error_response = {
            "error": str(e),
            "status": "error"
        }
        
        if 'httpMethod' in event:
            return {
                "statusCode": 500,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps(error_response)
            }
        raise e
