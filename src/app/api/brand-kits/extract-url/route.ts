import { NextResponse } from "next/server";
import { extractBrandFromWebsite } from "../../../../server/engine/brandKit";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, error: "Valid website URL is required" },
        { status: 400 }
      );
    }

    const brandData = await extractBrandFromWebsite(url);
    return NextResponse.json({ success: true, brandData });
  } catch (error: any) {
    console.error("Website extraction failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to extract brand data from website",
      },
      { status: 500 }
    );
  }
}
