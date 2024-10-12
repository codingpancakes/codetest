import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  try {
    const data = await request.json();
    const token = uuidv4();

    await kv.set(`widget-config:${token}`, data);

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error saving configuration:", error);
    return NextResponse.json(
      { error: "Failed to save configuration" },
      { status: 500 }
    );
  }
}
