import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { enhancePrompt } from "@/server/engine/promptEnhancer";

const EnhanceRequestSchema = z.object({
  prompt: z.string().trim().min(1, "Prompt cannot be empty"),
  style: z.string().optional(),
  niche: z.string().optional(),
  pinType: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = EnhanceRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Invalid input",
        },
        { status: 400 }
      );
    }

    const result = await enhancePrompt(parsed.data);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to enhance prompt";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
