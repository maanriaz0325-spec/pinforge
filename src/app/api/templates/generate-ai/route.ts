import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { decrypt } from "@/server/crypto/encryption";
import { draftTemplateWithAi } from "@/server/engine/templates";

const DraftAiSchema = z.object({
  nicheName: z.string().min(2, "Niche name is required"),
  tasteNotes: z.string().optional().default(""),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = DraftAiSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { nicheName, tasteNotes } = parsed.data;

    const settings = await prisma.settings.findUnique({ where: { id: "default" } });
    let openrouterApiKey = "";
    if (settings?.openrouterKeyEnc) {
      try {
        openrouterApiKey = decrypt(settings.openrouterKeyEnc);
      } catch {}
    } else if (process.env.OPENROUTER_API_KEY) {
      openrouterApiKey = process.env.OPENROUTER_API_KEY;
    }

    const draft = await draftTemplateWithAi(nicheName, tasteNotes, openrouterApiKey);

    return NextResponse.json({
      success: true,
      message: "Template drafted with AI (review before saving)",
      data: draft,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to draft template with AI";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
