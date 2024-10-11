import { NextResponse } from "next/server";
import configs from "../configs";

export async function GET(request, { params }) {
  const { token } = params;
  const config = configs.get(token);

  if (config) {
    return NextResponse.json(config);
  } else {
    return NextResponse.json(
      { error: "Configuration not found" },
      { status: 404 }
    );
  }
}
