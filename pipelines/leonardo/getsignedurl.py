import json
import os
import aiohttp
import asyncio
import logging
import boto3

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

# Initialize AWS clients
sfn = boto3.client('stepfunctions')

# Environment variables
LEONARDO_API_KEY = os.environ["LEONARDO_API_KEY"]
LEONARDO_API_URL = os.environ["LEONARDO_API_URL"]
STATE_MACHINE_ARN = os.environ.get("STATE_MACHINE_ARN")  # Optional for local testing

def lambda_handler(event, context):
    """
    Get a presigned URL from Leonardo.ai for image upload and trigger state machine
    """
    try:
        # Check if this is coming from API Gateway or Step Functions
        is_api_gateway = 'httpMethod' in event
        
        # Extract the body data
        if is_api_gateway:
            body = json.loads(event.get('body', '{}')) if isinstance(event.get('body'), str) else event.get('body', {})
        else:
            body = event
            
        # Extract required parameters
        image_path = body.get('image_path')
        prompt = body.get('prompt', '')
        width = body.get('width', 512)
        height = body.get('height', 512)
        num_images = body.get('num_images', 1)
        
        if not image_path:
            raise ValueError("image_path is required")
            
        # Get image format from path
        image_format = image_path.split('.')[-1].lower()
        if image_format == 'jpeg':
            image_format = 'jpg'
            
        # Run async code to get presigned URL
        response = asyncio.get_event_loop().run_until_complete(
            get_presigned_url(image_format)
        )
        
        if not response:
            raise Exception("Failed to get presigned URL")
            
        # Format response with ALL necessary parameters for the next step
        response_body = {
            "image_path": image_path,
            "prompt": prompt,
            "width": width,
            "height": height,
            "num_images": num_images,
            "upload_url": response[0],
            "fields": response[1],
            "upload_id": response[2]
        }

        logger.info(f"Processing completed. Response body: {json.dumps(response_body)}")

        if is_api_gateway:
            try:
                # Start the state machine execution
                if STATE_MACHINE_ARN:
                    execution = sfn.start_execution(
                        stateMachineArn=STATE_MACHINE_ARN,
                        name=f"ImageProcessing-{context.aws_request_id}",
                        input=json.dumps(response_body)
                    )
                    
                    return {
                        "statusCode": 200,
                        "headers": {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*"
                        },
                        "body": json.dumps({
                            "message": "Processing started",
                            "executionArn": execution['executionArn'],
                            "data": response_body  # Include the presigned URL data
                        })
                    }
                else:
                    return {
                        "statusCode": 200,
                        "headers": {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*"
                        },
                        "body": json.dumps({
                            "message": "Processing started (local testing)",
                            "data": response_body  # Include the presigned URL data
                        })
                    }
            except Exception as e:
                logger.error(f"Error starting state machine: {str(e)}")
                return {
                    "statusCode": 500,
                    "headers": {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    },
                    "body": json.dumps({"error": f"State machine error: {str(e)}"})
                }
        else:
            return response_body
        
    except Exception as e:
        logger.error(f"Error in lambda_handler: {str(e)}")
        if is_api_gateway:
            return {
                "statusCode": 500,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({"error": str(e)})
            }
        else:
            raise e

async def get_presigned_url(image_format: str):
    """Get a presigned URL for image upload"""
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": f"Bearer {LEONARDO_API_KEY}",
    }
    
    payload = {"extension": image_format}
    
    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(
                f"{LEONARDO_API_URL}/init-image",
                headers=headers,
                json=payload
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    logger.error(f"Leonardo API error: Status {response.status}, Response: {error_text}")
                    return None
                    
                data = await response.json()
                logger.info(f"Leonardo API response: {json.dumps(data)}")
                
                if not data or "uploadInitImage" not in data:
                    logger.error(f"Unexpected response format: {json.dumps(data)}")
                    return None
                    
                upload_data = data["uploadInitImage"]
                if not all(k in upload_data for k in ["url", "fields", "id"]):
                    logger.error(f"Missing required fields in upload data: {json.dumps(upload_data)}")
                    return None
                
                # Parse fields if it's a string
                fields = upload_data["fields"]
                if isinstance(fields, str):
                    fields = json.loads(fields)
                
                return upload_data["url"], fields, upload_data["id"]
                
        except Exception as e:
            logger.error(f"Error getting presigned URL: {str(e)}")
            return None