import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { decrypt } from "@/server/crypto/encryption";
import { fetchFreeOpenRouterModels } from "@/server/providers/openrouter";

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: "default" },
    });

    let plainKey = "";
    if (settings?.openrouterKeyEnc) {
      try {
        plainKey = decrypt(settings.openrouterKeyEnc);
      } catch {}
    }

    const models = await fetchFreeOpenRouterModels(plainKey);
    return NextResponse.json({
      success: true,
      data: models,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch OpenRouter models";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
