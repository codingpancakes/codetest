import json
import boto3
import os
import aiohttp
import asyncio
from PIL import Image
import io
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

s3 = boto3.client('s3')

def lambda_handler(event, context):
    """
    Upload image to Leonardo.ai using presigned URL
    Input event format:
    {
        "image_path": "s3://bucket-name/path/to/image.jpg",
        "prompt": "prompt text",
        "num_images": 1,
        "upload_url": "presigned_url",
        "fields": "fields_json",
        "upload_id": "upload_id"
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
            
        logger.info(f"Received event body: {json.dumps(body)}")
        
        # Extract parameters
        image_path = body['image_path']
        prompt = body.get('prompt', '')
        num_images = body.get('num_images', 1)
        upload_url = body['upload_url']
        fields = body['fields']
        upload_id = body['upload_id']
        
        # Parse S3 path
        bucket = image_path.split('/')[2]
        key = '/'.join(image_path.split('/')[3:])
        
        # Get image from S3
        response = s3.get_object(Bucket=bucket, Key=key)
        image_data = response['Body'].read()
        
        # Get image format, dimensions and mime type
        with Image.open(io.BytesIO(image_data)) as img:
            width, height = img.size
            format = img.format.lower()
            mime_type = f"image/{format}"
            if format == "jpeg":
                format = "jpg"
                mime_type = "image/jpeg"
                
        logger.info(f"Image dimensions: {width}x{height}")

        # Upload to Leonardo
        asyncio.get_event_loop().run_until_complete(
            upload_to_presigned_url(
                upload_url,
                json.loads(fields) if isinstance(fields, str) else fields,
                image_data,
                mime_type
            )
        )

        # Return all parameters needed for the next step
        response_body = {
            "image_path": image_path,
            "prompt": prompt,
            "width": width,
            "height": height,
            "num_images": num_images,
            "upload_id": upload_id,
            "status": "uploaded",
            "output_path": f"generations/{upload_id}"
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

async def upload_to_presigned_url(url, fields, file_data, content_type):
    try:
        async with aiohttp.ClientSession() as session:
            form = aiohttp.FormData()
            
            # Add all fields from the presigned URL
            for field_name, field_value in fields.items():
                form.add_field(field_name, field_value)
            
            # Add the file as the last field
            form.add_field('file', file_data,
                         filename='image.jpg',
                         content_type=content_type)
            
            async with session.post(url, data=form) as response:
                if response.status != 204:
                    text = await response.text()
                    raise Exception(f"Upload failed with status {response.status}: {text}")
                    
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise e
