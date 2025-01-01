import os
import json
import time
import requests
import aiohttp
import asyncio
import logging
import uuid
import boto3

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

# Initialize S3 client
s3 = boto3.client('s3')

LEONARDO_API_KEY = os.environ["LEONARDO_API_KEY"]
LEONARDO_MODEL_ID = os.environ.get("LEONARDO_MODEL_ID", "aa77f04e-3eec-4034-9c07-d0f619684628")  # Leonardo Kino XL
LEONARDO_API_URL = "https://cloud.leonardo.ai/api/rest/v1"
S3_BUCKET = os.environ["S3_BUCKET"]

def lambda_handler(event, context):
    """
    Generate an image using Leonardo.ai
    Input event format:
    {
        "prompt": "prompt text",
        "upload_id": "leonardo_upload_id",
        "width": width,
        "height": height,
        "num_images": 1,
        "output_path": "generations/uuid"
    }
    """
    try:
        # Handle both direct invocation and API Gateway event
        if 'body' in event:
            if isinstance(event['body'], str):
                body = json.loads(event['body'])
            else:
                body = event['body']
        else:
            body = event

        prompt = body.get("prompt")
        width = body.get("width")
        height = body.get("height")
        num_images = body.get("num_images", 1)
        output_path = body.get("output_path")
        
        # For Step Functions initial request, we don't need upload_id
        upload_id = body.get("upload_id")
        if not upload_id:
            # Validate other required parameters
            if not all([prompt, width, height, output_path]):
                raise ValueError("Missing required parameters: prompt, width, height, or output_path")
            # Return early with the parameters for the Step Function
            return {
                "status": "success",
                "parameters": {
                    "prompt": prompt,
                    "width": width,
                    "height": height,
                    "num_images": num_images,
                    "output_path": output_path
                }
            }

        # If we have upload_id, proceed with generation
        logger.info(f"Starting generation with dimensions {width}x{height}")

        # Run async code
        response = asyncio.get_event_loop().run_until_complete(
            create_generation(upload_id, width, height, prompt, num_images)
        )

        if not response:
            raise Exception("Failed to create generation")

        # Wait for generation to complete
        generation_id = response.get("sdGenerationJob", {}).get("generationId")
        if not generation_id:
            raise Exception("No generation ID in response")

        result = asyncio.get_event_loop().run_until_complete(
            wait_for_generation(generation_id)
        )

        # Download and save generated images
        generated_images = []
        for i, image_url in enumerate(result.get("generated_images", []), 1):
            # Generate filename for each image
            filename = f"{output_path}/gen_{i}.png"
            
            # Download and save to S3
            response = requests.get(image_url)
            response.raise_for_status()
            
            s3.put_object(
                Bucket=S3_BUCKET,
                Key=filename,
                Body=response.content,
                ContentType='image/png'
            )
            
            # Add to list of generated images
            generated_images.append({
                'image_path': f"s3://{S3_BUCKET}/{filename}",
                'original_url': image_url
            })

        response_body = {
            "status": "success",
            "generation_id": generation_id,
            "generated_images": generated_images,
            "original_prompt": prompt
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

    except Exception as e:
        logger.error(f"Error: {str(e)}")
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

async def create_generation(image_id: str, width: int, height: int, prompt: str, num_images: int):
    """Create a new image generation using the uploaded image"""
    try:
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": f"Bearer {LEONARDO_API_KEY}"
        }

        # Adjust dimensions to be within acceptable ranges
        width = min(max(width, 32), 1024)
        height = min(max(height, 32), 1024)
        
        # Keep aspect ratio and ensure dimensions are multiples of 8
        width = (width // 8) * 8
        height = (height // 8) * 8

        payload = {
            "height": height,
            "width": width,
            "modelId": LEONARDO_MODEL_ID,
            "prompt": prompt,
            "presetStyle": "CINEMATIC",
            "photoReal": True,
            "photoRealVersion": "v2",
            "alchemy": True,
            "num_images": num_images,
            "controlnets": [
                {
                    "initImageId": image_id,
                    "initImageType": "UPLOADED",
                    "preprocessorId": 100,
                    "strengthType": "Mid",
                }
            ],
        }

        logger.info(f"Starting generation with payload: {payload}")

        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{LEONARDO_API_URL}/generations",
                headers=headers,
                json=payload
            ) as response:
                response_text = await response.text()
                logger.info(f"Generation API Response: {response_text}")

                if response.status != 200:
                    raise Exception(f"Failed to create generation: {response_text}")

                try:
                    return json.loads(response_text)
                except json.JSONDecodeError:
                    raise Exception("Invalid JSON response from generation API")

    except Exception as e:
        logger.error(f"Error creating generation: {str(e)}")
        raise e

async def wait_for_generation(generation_id: str, timeout: int = 840, check_interval: int = 5):
    """Wait for generation to complete"""
    try:
        headers = {
            "accept": "application/json",
            "authorization": f"Bearer {LEONARDO_API_KEY}"
        }

        start_time = time.time()
        while True:
            if time.time() - start_time > timeout:
                raise TimeoutError(f"Generation timed out after {timeout} seconds")

            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{LEONARDO_API_URL}/generations/{generation_id}",
                    headers=headers
                ) as response:
                    if response.status != 200:
                        text = await response.text()
                        raise Exception(f"Failed to check generation status: {text}")
                    
                    data = await response.json()
                    status = data.get("generations_by_pk", {}).get("status")
                    
                    if status == "COMPLETE":
                        return {
                            "status": "complete",
                            "generated_images": [
                                img.get("url") for img in data.get("generations_by_pk", {}).get("generated_images", [])
                            ]
                        }
                    elif status == "FAILED":
                        raise Exception("Generation failed")

            await asyncio.sleep(check_interval)

    except Exception as e:
        logger.error(f"Error waiting for generation: {str(e)}")
        raise e
