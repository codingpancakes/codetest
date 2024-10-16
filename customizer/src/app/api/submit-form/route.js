import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

function setCORSHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*'); // Replace '*' with your domain in production
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

export async function POST(request) {
    try {
      const formData = await request.formData();
      const yardSpace = formData.get('yardSpace');
      const style = formData.getAll('style');
      const _gardenPhoto = formData.get('gardenPhoto'); 
      
      await new Promise((resolve) => setTimeout(resolve, 3000));
  
      const submissionId = `form-submission:${new Date().toISOString()}`;
      await kv.set(submissionId, { yardSpace, style });
  
      const response = NextResponse.json({
        message: `AI has beautifully transformed your garden photo!`,
      });
  
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
  

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCORSHeaders(response);
}
