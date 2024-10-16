import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

function setCORSHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*'); 
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

export async function POST(request) {
  try {
    const data = await request.json();

    const { configToken, ...formData } = data;

    const submissionId = `form-submission:${new Date().toISOString()}`;
    await kv.set(submissionId, { configToken, ...formData });

    const responseMessage = `Form submitted successfully! Data received: ${formData.yardSpace || 'N/A'}, ${formData.style || 'N/A'} (Widget Token: ${configToken})`;

    const response = NextResponse.json({ message: responseMessage });

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
