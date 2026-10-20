import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { encrypt, decrypt, maskApiKey } from "@/server/crypto/encryption";

const SettingsUpdateSchema = z.object({
  runwareKey: z.string().optional(),
  openrouterKey: z.string().optional(),
  defaultTextModel: z.string().min(1).optional(),
  defaultImageModel: z.string().min(1).optional(),
  currency: z.string().min(1).max(5).optional(),
  timezone: z.string().min(1).optional(),
  monthlyBudget: z.number().nonnegative().optional(),
  maxConcurrency: z.number().int().min(1).max(10).optional(),
});

export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: { id: "default" },
      });
    }

    // Decrypt momentarily on server solely to extract the masked suffix
    let runwarePlain = "";
    let openrouterPlain = "";

    try {
      if (settings.runwareKeyEnc) {
        runwarePlain = decrypt(settings.runwareKeyEnc);
      }
    } catch {
      // Key corrupted or encryption key mismatch
    }

    try {
      if (settings.openrouterKeyEnc) {
        openrouterPlain = decrypt(settings.openrouterKeyEnc);
      }
    } catch {
      // Key corrupted or encryption key mismatch
    }

    return NextResponse.json({
      success: true,
      data: {
        hasRunwareKey: Boolean(runwarePlain),
        runwareKeyMasked: maskApiKey(runwarePlain),
        hasOpenrouterKey: Boolean(openrouterPlain),
        openrouterKeyMasked: maskApiKey(openrouterPlain),
        defaultTextModel: settings.defaultTextModel,
        defaultImageModel: settings.defaultImageModel,
        currency: settings.currency,
        timezone: settings.timezone,
        monthlyBudget: settings.monthlyBudget,
        maxConcurrency: settings.maxConcurrency,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load settings";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SettingsUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      runwareKey,
      openrouterKey,
      defaultTextModel,
      defaultImageModel,
      currency,
      timezone,
      monthlyBudget,
      maxConcurrency,
    } = parsed.data;

    const updateData: Record<string, unknown> = {};

    if (runwareKey !== undefined && runwareKey.trim() !== "") {
      updateData.runwareKeyEnc = encrypt(runwareKey.trim());
    }

    if (openrouterKey !== undefined && openrouterKey.trim() !== "") {
      updateData.openrouterKeyEnc = encrypt(openrouterKey.trim());
    }

    if (defaultTextModel !== undefined) updateData.defaultTextModel = defaultTextModel;
    if (defaultImageModel !== undefined) updateData.defaultImageModel = defaultImageModel;
    if (currency !== undefined) updateData.currency = currency;
    if (timezone !== undefined) updateData.timezone = timezone;
    if (monthlyBudget !== undefined) updateData.monthlyBudget = monthlyBudget;
    if (maxConcurrency !== undefined) updateData.maxConcurrency = maxConcurrency;

    const updated = await prisma.settings.upsert({
      where: { id: "default" },
      update: updateData,
      create: {
        id: "default",
        ...updateData,
      },
    });

    let runwarePlain = "";
    let openrouterPlain = "";
    try {
      if (updated.runwareKeyEnc) runwarePlain = decrypt(updated.runwareKeyEnc);
    } catch {}
    try {
      if (updated.openrouterKeyEnc) openrouterPlain = decrypt(updated.openrouterKeyEnc);
    } catch {}

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
      data: {
        hasRunwareKey: Boolean(runwarePlain),
        runwareKeyMasked: maskApiKey(runwarePlain),
        hasOpenrouterKey: Boolean(openrouterPlain),
        openrouterKeyMasked: maskApiKey(openrouterPlain),
        defaultTextModel: updated.defaultTextModel,
        defaultImageModel: updated.defaultImageModel,
        currency: updated.currency,
        timezone: updated.timezone,
        monthlyBudget: updated.monthlyBudget,
        maxConcurrency: updated.maxConcurrency,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update settings";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
