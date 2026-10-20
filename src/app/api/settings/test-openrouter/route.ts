import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { decrypt } from "@/server/crypto/encryption";
import { testOpenRouterConnection } from "@/server/providers/openrouter";

export async function POST(req: NextRequest) {
  try {
    let body: { apiKey?: string } = {};
    try {
      body = await req.json();
    } catch {}

    let keyToTest = body.apiKey?.trim();

    // If key not supplied directly in request, fetch and decrypt stored key
    if (!keyToTest) {
      const settings = await prisma.settings.findUnique({
        where: { id: "default" },
      });

      if (!settings?.openrouterKeyEnc) {
        return NextResponse.json(
          {
            success: false,
            status: "invalid_key",
            message: "No OpenRouter API key saved or provided.",
          },
          { status: 400 }
        );
      }

      keyToTest = decrypt(settings.openrouterKeyEnc);
    }

    const result = await testOpenRouterConnection(keyToTest);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error testing OpenRouter connection";
    return NextResponse.json(
      {
        success: false,
        status: "network_error",
        message,
      },
      { status: 500 }
    );
  }
}
