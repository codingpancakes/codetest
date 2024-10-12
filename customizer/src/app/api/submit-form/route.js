import { NextResponse } from 'next/server';

function setCORSHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*'); // Replace '*' with your allowed origin(s) in production
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCORSHeaders(response);
}

export async function POST(request) {
  try {
    const data = await request.json();
    const responseMessage = `Server received: ${data.question1}, ${data.question2}`;

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
