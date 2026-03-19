// Pure, side-effect-free slot-filter functions.
// No chrome.* references — safe to unit-test in Node/Vitest.
//
// Slot shape from CBP API: { startTimestamp: '2026-03-20T09:00:00', locationId: 5020, ... }
// Config shape:            { dateRange: {start, end}, timeRange: {start, end}, notifiedSlots: {} }

/**
 * Returns true if the slot's startTimestamp falls within the configured date range.
 * Both bounds are optional; an absent bound is treated as unbounded.
 * Comparison is lexicographic on ISO-8601 strings (safe because they're zero-padded).
 */
export function isSlotInDateRange(slot, config) {
  const { start, end } = config.dateRange ?? {};
  if (start && slot.startTimestamp < start) return false;
  if (end   && slot.startTimestamp > end)   return false;
  return true;
}

/**
 * Returns true if the slot's time-of-day falls within the configured time range.
 * Both bounds are optional; if neither is set the slot always passes.
 *
 * Supports midnight-crossover ranges (e.g. from=22:00 to=06:00): a slot matches
 * if its time is >= start OR <= end.
 */
export function isSlotInTimeRange(slot, config) {
  const { start, end } = config.timeRange ?? {};
  if (!start && !end) return true;
  const time = slot.startTimestamp.split('T')[1]; // 'HH:MM:SS'
  if (start && end && start > end) {
    // Midnight-crossover: match if time >= start OR time <= end
    return time >= start || time <= end;
  }
  if (start && time < start) return false;
  if (end   && time > end)   return false;
  return true;
}

/**
 * Returns true if this slot was already notified within the last 24 hours.
 * Key format: '<locationId>-<startTimestamp>'
 * notifiedSlots maps key → Unix timestamp (ms) of when we last notified.
 */
export function isDuplicate(slot, notifiedSlots) {
  const key = `${slot.locationId}-${slot.startTimestamp}`;
  if (!(key in notifiedSlots)) return false;
  return Date.now() - notifiedSlots[key] < 24 * 60 * 60 * 1000;
}

/**
 * Returns a new notifiedSlots object with entries older than 24 hours removed.
 * Pure — does not mutate the input.
 */
export function pruneOldSlots(notifiedSlots) {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  return Object.fromEntries(
    Object.entries(notifiedSlots).filter(([, ts]) => ts >= cutoff)
  );
}
