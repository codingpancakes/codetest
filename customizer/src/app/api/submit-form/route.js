import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// Helper function to set CORS headers
function setCORSHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*'); // Replace '*' with your domain in production
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

// Handle form submission (POST request)
export async function POST(request) {
  try {
    const formData = await request.formData();
    const yardSpace = formData.get('yardSpace');
    const style = formData.getAll('style');
    const gardenPhoto = formData.get('gardenPhoto'); // Garden photo file (you may process it later)

    // Simulate AI processing (add a delay to mimic the process)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Store the form submission (excluding the image) in KV
    const submissionId = `form-submission:${new Date().toISOString()}`;
    await kv.set(submissionId, { yardSpace, style });

    const response = NextResponse.json({
      message: `AI has beautifully transformed your garden photo!`,
    });

    // Set CORS headers
    return setCORSHeaders(response);
  } catch (error) {
    console.error('Error processing form submission:', error);
    const response = NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
    return setCORSHeaders(response);
  }
}

// Handle preflight (OPTIONS request)
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCORSHeaders(response);
}
