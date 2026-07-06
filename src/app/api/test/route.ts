import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;

    await client.db().admin().ping();

    return NextResponse.json({
      success: true,
      message: "MongoDB Connected Successfully!",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown Error",
    });
  }
}