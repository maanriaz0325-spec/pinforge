export interface AutoSpreadParams {
  pinCount: number;
  startDate?: Date | string;
  pinsPerDay?: number;
  postingHours?: number[]; // e.g. [9, 14, 20] -> 9am, 2pm, 8pm
  jitterMinutes?: number;  // e.g. 15 -> ±15 min jitter
}

export interface ScheduledSlot {
  index: number;
  date: Date;
  dateIso: string;
  formattedTime: string;
}

/**
 * Distributes N pins across calendar days per Spec Section 36
 * Spreads pins evenly across chosen posting hours with randomized natural jitter.
 */
export function calculateAutoSpreadDates(params: AutoSpreadParams): ScheduledSlot[] {
  const {
    pinCount,
    startDate = new Date(),
    pinsPerDay = 3,
    postingHours = [9, 14, 20],
    jitterMinutes = 15,
  } = params;

  if (pinCount <= 0) return [];

  const baseDate = new Date(startDate);
  // Start tomorrow morning if given time is already past evening posting hour
  if (baseDate.getHours() >= (postingHours[postingHours.length - 1] || 20)) {
    baseDate.setDate(baseDate.getDate() + 1);
  }

  const slots: ScheduledSlot[] = [];
  const hours = postingHours.length > 0 ? postingHours : [9, 14, 20];
  const countPerDay = Math.max(1, Math.min(hours.length, pinsPerDay));

  let currentDayOffset = 0;
  let slotInDay = 0;

  for (let i = 0; i < pinCount; i++) {
    const slotDate = new Date(baseDate);
    slotDate.setDate(baseDate.getDate() + currentDayOffset);

    // Pick hour
    const hour = hours[slotInDay % hours.length];
    slotDate.setHours(hour, 0, 0, 0);

    // Deterministic pseudo-random jitter based on index to prevent exact collisions
    const jitter = ((i * 17 + 7) % (jitterMinutes * 2 + 1)) - jitterMinutes;
    slotDate.setMinutes(slotDate.getMinutes() + jitter);

    slots.push({
      index: i,
      date: slotDate,
      dateIso: slotDate.toISOString(),
      formattedTime: slotDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    });

    slotInDay++;
    if (slotInDay >= countPerDay) {
      slotInDay = 0;
      currentDayOffset++;
    }
  }

  return slots;
}
