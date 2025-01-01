import asyncio
import json
import os
from getsignedurl import get_presigned_url
from upload import upload_to_presigned_url
from generation import create_generation, wait_for_generation

async def test_pipeline(image_path: str, prompt: str):
    try:
        print("Starting pipeline test...")
        
        # Get image format
        image_format = image_path.split('.')[-1].lower()
        if image_format == 'jpeg':
            image_format = 'jpg'
        
        # Step 1: Get signed URL
        print("\n1. Getting signed URL...")
        url_response = await get_presigned_url(image_format)
        if not url_response:
            raise Exception("Failed to get signed URL")
        upload_url, fields, upload_id = url_response
        print(f"Got upload_id: {upload_id}")
        
        # Step 2: Upload image
        print("\n2. Uploading image...")
        with open(image_path, 'rb') as f:
            image_data = f.read()
        
        success = await upload_to_presigned_url(
            upload_url,
            fields,
            image_data,
            f"image/{image_format}"
        )
        if not success:
            raise Exception("Failed to upload image")
        print("Upload successful")
        
        # Step 3: Generate images
        print("\n3. Starting generation...")
        gen_response = await create_generation(
            upload_id,
            512, 512,  # width, height
            prompt,
            1  # num_images
        )
        if not gen_response:
            raise Exception("Failed to start generation")
            
        generation_id = gen_response["sdGenerationJob"]["generationId"]
        print(f"Generation started with ID: {generation_id}")
        
        # Step 4: Wait for results
        print("\n4. Waiting for generation to complete...")
        result = await wait_for_generation(generation_id)
        print("\nGeneration complete!")
        print(json.dumps(result, indent=2))
        
        return result
        
    except Exception as e:
        print(f"\nError in pipeline: {str(e)}")
        raise

if __name__ == "__main__":
    # Check environment variables
    if not os.environ.get("LEONARDO_API_KEY"):
        raise ValueError("LEONARDO_API_KEY environment variable is required")
    if not os.environ.get("LEONARDO_API_URL"):
        raise ValueError("LEONARDO_API_URL environment variable is required")
    
    # Get parameters
    image_path = input("Enter path to image file: ")
    prompt = input("Enter generation prompt: ")
    
    # Run test
    asyncio.run(test_pipeline(image_path, prompt))
