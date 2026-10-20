import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: "default" },
    });

    const monthlyBudget = settings?.monthlyBudget ?? 50.0;

    // 1. Total Pins count
    const totalPins = await prisma.pin.count();

    // 2. All Cost Events
    const costEvents = await prisma.costEvent.findMany({
      orderBy: { createdAt: "desc" },
    });

    const totalCost = costEvents.reduce((sum, e) => sum + (e.amount || 0), 0);
    const avgCostPerPin = totalPins > 0 ? totalCost / totalPins : 0;

    // 3. Current Month Spend for Budget Guard
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthCostEvents = costEvents.filter((e) => new Date(e.createdAt) >= startOfMonth);
    const currentMonthSpend = monthCostEvents.reduce((sum, e) => sum + (e.amount || 0), 0);
    const budgetPercent = monthlyBudget > 0 ? (currentMonthSpend / monthlyBudget) * 100 : 0;

    // 4. Spend by Model
    const modelSpendMap: Record<string, { model: string; count: number; spend: number }> = {};
    for (const event of costEvents) {
      const key = event.model || "Unknown";
      if (!modelSpendMap[key]) {
        modelSpendMap[key] = { model: key, count: 0, spend: 0 };
      }
      modelSpendMap[key].count++;
      modelSpendMap[key].spend += event.amount || 0;
    }

    // 5. Spend by Brand Kit
    const brandKits = await prisma.brandKit.findMany({
      select: { id: true, brandName: true, kitName: true },
    });
    const kitMap = new Map(brandKits.map((k) => [k.id, k.brandName || k.kitName]));

    const pinsWithKits = await prisma.pin.findMany({
      select: { brandKitId: true, cost: true },
    });

    const kitSpendMap: Record<string, { name: string; count: number; spend: number }> = {};
    for (const pin of pinsWithKits) {
      const name = pin.brandKitId ? kitMap.get(pin.brandKitId) || "Custom Kit" : "No Brand Kit";
      if (!kitSpendMap[name]) {
        kitSpendMap[name] = { name, count: 0, spend: 0 };
      }
      kitSpendMap[name].count++;
      kitSpendMap[name].spend += pin.cost || 0;
    }

    // 6. Recent Ledger Events
    const recentLedger = costEvents.slice(0, 25).map((e) => ({
      id: e.id,
      jobId: e.jobId,
      pinId: e.pinId,
      kind: e.kind,
      model: e.model,
      amount: e.amount,
      createdAt: e.createdAt,
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalPins,
        totalCost,
        avgCostPerPin,
        monthlyBudget,
        currentMonthSpend,
        budgetPercent,
        spendByModel: Object.values(modelSpendMap),
        spendByBrandKit: Object.values(kitSpendMap),
        recentLedger,
      },
    });
  } catch (error: any) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load stats" },
      { status: 500 }
    );
  }
}
