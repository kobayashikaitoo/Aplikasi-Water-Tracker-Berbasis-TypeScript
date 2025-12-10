
export function calculateDailyWaterTarget({
  weightKg,
  sex,
}: {
  weightKg: number;
  sex: 'male' | 'female';
}): number {
  let targetMl = weightKg * 35;

  if (sex === 'male') {
    targetMl = targetMl * 1.1;
  }

  // Use a sane minimum of 1500ml instead of hard IOM limits (3700/2700) which include food water
  targetMl = Math.max(targetMl, 1500);

  const MAX_SAFE = 10000;
  return Math.round(Math.min(targetMl, MAX_SAFE));
}

/**
 * Calculates reminder times between wake and sleep times.
 * @param wakeTime - Wake up time in "HH:MM" format (24h)
 * @param sleepTime - Sleep time in "HH:MM" format (24h)
 * @param targetMl - Daily water target in ml
 * @param reminders - Number of reminders (default 8)
 */
export function generateReminderSchedule({
  wakeTime,
  sleepTime,
  targetMl,
  reminders = 8,
}: {
  wakeTime: string;
  sleepTime: string;
  targetMl: number;
  reminders?: number;
}) {
  const [wakeHour, wakeMinute] = wakeTime.split(':').map(Number);
  const [sleepHour, sleepMinute] = sleepTime.split(':').map(Number);

  // Convert to minutes from midnight
  const wakeTotalMinutes = wakeHour * 60 + wakeMinute;
  let sleepTotalMinutes = sleepHour * 60 + sleepMinute;

  // Handle case where sleep time is next day (e.g. 01:00)
  if (sleepTotalMinutes < wakeTotalMinutes) {
    sleepTotalMinutes += 24 * 60;
  }

  const awakeMinutes = sleepTotalMinutes - wakeTotalMinutes;
  // If awake time is unreasonably small (e.g. < 4 hours), default to a standard day or warn
  // keeping it simple for now.

  const intervalMinutes = awakeMinutes / reminders;
  const mlPerReminder = Math.round(targetMl / reminders);

  const times: string[] = [];
  for (let i = 0; i < reminders; i++) {
    const reminderMinutes = wakeTotalMinutes + (i + 1) * intervalMinutes; // Start 1 interval after wake
    // Or start AT wake time? Prompt says "Distribute ... between wake-sleep".
    // Usually reminders start a bit after waking or spread evenly.
    // Let's do Standard distribution: Start at wake + interval.

    // Normalize to 24h
    let normalizedMinutes = Math.floor(reminderMinutes);
    if (normalizedMinutes >= 24 * 60) normalizedMinutes -= 24 * 60;

    const h = Math.floor(normalizedMinutes / 60);
    const m = normalizedMinutes % 60;
    times.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
  }

  return { times, mlPerReminder };
}
