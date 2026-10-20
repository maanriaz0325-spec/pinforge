import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export async function GET() {
  try {
    // Scheduled or published pins
    const scheduledPins = await prisma.pin.findMany({
      where: {
        scheduleDate: { not: null },
      },
      orderBy: [{ scheduleDate: "asc" }, { scheduleTime: "asc" }],
      include: {
        brandKit: {
          select: { id: true, brandName: true, kitName: true },
        },
      },
    });

    // Unscheduled draft pins eligible for scheduling
    const unscheduledPins = await prisma.pin.findMany({
      where: {
        scheduleDate: null,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        brandKit: {
          select: { id: true, brandName: true, kitName: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      scheduled: scheduledPins,
      unscheduled: unscheduledPins,
    });
  } catch (error: any) {
    console.error("Failed to load schedule:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load schedule" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pinId, scheduledDate, status, used } = body;

    if (!pinId) {
      return NextResponse.json(
        { success: false, error: "pinId is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (scheduledDate !== undefined) {
      if (scheduledDate) {
        const d = new Date(scheduledDate);
        updateData.scheduleDate = d.toISOString().split("T")[0];
        updateData.scheduleTime = d.toISOString().split("T")[1].slice(0, 5);
        if (!status) updateData.status = "SCHEDULED";
      } else {
        updateData.scheduleDate = null;
        updateData.scheduleTime = null;
        if (!status) updateData.status = "DRAFT";
      }
    }
    if (status) {
      updateData.status = status;
      if (status === "PUBLISHED") {
        updateData.used = true;
        updateData.usedAt = new Date();
      } else if (status === "SCHEDULED" || status === "DRAFT") {
        updateData.used = false;
        updateData.usedAt = null;
      }
    }
    if (used !== undefined) {
      updateData.used = Boolean(used);
      if (used) {
        updateData.status = "PUBLISHED";
        updateData.usedAt = new Date();
      }
    }

    const updatedPin = await prisma.pin.update({
      where: { id: pinId },
      data: updateData,
    });

    return NextResponse.json({ success: true, pin: updatedPin });
  } catch (error: any) {
    console.error("Failed to update pin schedule:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update pin schedule" },
      { status: 500 }
    );
  }
}
