import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import configs from '../configs';

export async function POST(request) {
  const data = await request.json();
  const token = uuidv4();
  configs.set(token, data);

  return NextResponse.json({ token });
}
