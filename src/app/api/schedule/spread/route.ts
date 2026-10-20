import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { calculateAutoSpreadDates } from "@/server/engine/scheduler";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      pinIds,
      startDate,
      pinsPerDay = 3,
      hours = [9, 14, 20],
      jitterMinutes = 15,
    } = body;

    if (!Array.isArray(pinIds) || pinIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "Array of pinIds is required" },
        { status: 400 }
      );
    }

    const slots = calculateAutoSpreadDates({
      pinCount: pinIds.length,
      startDate: startDate ? new Date(startDate) : new Date(),
      pinsPerDay: Number(pinsPerDay) || 3,
      postingHours: Array.isArray(hours) && hours.length > 0 ? hours : [9, 14, 20],
      jitterMinutes: Number(jitterMinutes) || 15,
    });

    const updates = await prisma.$transaction(
      pinIds.map((pinId, index) => {
        const slot = slots[index];
        return prisma.pin.update({
          where: { id: pinId },
          data: {
            scheduleDate: slot.dateIso.split("T")[0],
            scheduleTime: slot.dateIso.split("T")[1].slice(0, 5),
            status: "SCHEDULED",
            used: false,
          },
        });
      })
    );

    return NextResponse.json({
      success: true,
      count: updates.length,
      scheduledPins: updates,
    });
  } catch (error: any) {
    console.error("Auto-spread failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to auto-spread pins" },
      { status: 500 }
    );
  }
}
