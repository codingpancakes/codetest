import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function GET(request, { params }) {
  try {
    const { token } = params;

    const config = await kv.get(`widget-config:${token}`);

    if (config) {
      const response = NextResponse.json(config);
      response.headers.set("Access-Control-Allow-Origin", "*"); 
      return response;
    } else {
      return NextResponse.json(
        { error: "Configuration not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error retrieving configuration:", error);
    return NextResponse.json(
      { error: "Failed to retrieve configuration" },
      { status: 500 }
    );
  }
}
