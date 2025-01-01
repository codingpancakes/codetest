# Leonardo.ai Image Generation Pipeline

This pipeline handles image generation using Leonardo.ai API. It's designed to be deployed as an AWS Step Functions workflow.

## Setup Development Environment

### Python Setup
1. Create and activate virtual environment:
   ```bash
   # Create virtual environment
   python3 -m venv venv

   # Activate virtual environment
   # On macOS/Linux:
   source venv/bin/activate
   # On Windows:
   # .\venv\Scripts\activate

   # Verify you're in the virtual environment
   which python  # Should point to your venv
   ```

2. Install Python dependencies:
   ```bash
   # Upgrade pip
   pip install --upgrade pip

   # Install project dependencies
   pip install -r requirements.txt
   ```

### Node.js Setup (for deployment)
1. Install Node.js dependencies:
   ```bash
   # Install dependencies from package.json
   npm install
   ```

## Pipeline Flow

1. **Get Signed URL** (`getsignedurl.py`)
   - Input:
     ```json
     {
       "image_path": "s3://bucket/path/to/image.jpg",
       "prompt": "your prompt text",
       "width": 512,  // optional
       "height": 512,  // optional
       "num_images": 1  // optional
     }
     ```
   - Output:
     ```json
     {
       "image_path": "s3://bucket/path/to/image.jpg",
       "prompt": "your prompt text",
       "width": 512,
       "height": 512,
       "num_images": 1,
       "upload_url": "presigned_url",
       "fields": "fields_json",
       "upload_id": "upload_id"
     }
     ```

2. **Upload Image** (`upload.py`)
   - Uses output from previous step
   - Uploads image to Leonardo.ai
   - Returns same data plus upload confirmation

3. **Generate Images** (`generation.py`)
   - Generates images using Leonardo.ai
   - Returns generated image URLs and paths

## Local Testing

1. Set up environment variables:
   ```bash
   # Required for local testing
   export LEONARDO_API_KEY="your_api_key"
   export LEONARDO_API_URL="https://cloud.leonardo.ai/api/rest/v1"

   # Optional - only needed when testing with AWS Step Functions
   # export STATE_MACHINE_ARN="your_state_machine_arn"
   ```

2. Run test script:
   ```bash
   python test_pipeline.py
   ```

## AWS Deployment

1. Configure AWS credentials:
   ```bash
   aws configure
   ```

2. Set up SSM parameters:
   ```bash
   aws ssm put-parameter --name /plantista/leonardo-api-key --value "your_api_key" --type SecureString
   aws ssm put-parameter --name /plantista/leonardo-api-url --value "https://cloud.leonardo.ai/api/rest/v1" --type String
   ```

3. Deploy:
   ```bash
   serverless deploy
   ```

## API Usage

After deployment, you'll get an API endpoint. Call it with:

```bash
curl -X POST https://your-api-endpoint/get-signed-url \
  -H "Content-Type: application/json" \
  -d '{
    "image_path": "s3://your-bucket/image.jpg",
    "prompt": "your generation prompt",
    "width": 512,
    "height": 512,
    "num_images": 1
  }'
```

The API will return an execution ARN that you can use to track the progress of your generation.
