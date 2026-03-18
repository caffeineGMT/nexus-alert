/**
 * Unit tests for slot-filter pure functions extracted from background.js.
 *
 * Run: npm test
 *
 * Known limitation documented in isSlotInTimeRange: midnight-crossover ranges
 * (e.g. from=22:00 to=06:00) are NOT supported — the current implementation uses
 * lexicographic string comparison on 'HH:MM:SS', so a slot at 23:30 falls outside
 * a 22:00–06:00 range because '23:30:00' > '06:00:00' fails the upper-bound check.
 * The midnight-crossover test case below locks this known behavior rather than
 * asserting the "correct" (unimplemented) behavior.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  isSlotInDateRange,
  isSlotInTimeRange,
  isDuplicate,
  pruneOldSlots,
} from '../src/slotFilters.js';

const makeSlot = (ts, locId = 5020) => ({ startTimestamp: ts, locationId: locId });

afterEach(() => {
  vi.useRealTimers();
});

// ─── isSlotInDateRange — 7 cases ───────────────────────────────────────────

describe('isSlotInDateRange', () => {
  it('passes when both bounds are absent', () => {
    expect(isSlotInDateRange(makeSlot('2026-05-01T10:00:00'), { dateRange: {} })).toBe(true);
  });

  it('passes when slot falls within [start, end]', () => {
    expect(
      isSlotInDateRange(makeSlot('2026-05-01T10:00:00'), {
        dateRange: { start: '2026-04-01T00:00:00', end: '2026-06-01T00:00:00' },
      })
    ).toBe(true);
  });

  it('fails when slot is before start', () => {
    expect(
      isSlotInDateRange(makeSlot('2026-03-01T10:00:00'), {
        dateRange: { start: '2026-04-01T00:00:00', end: '2026-06-01T00:00:00' },
      })
    ).toBe(false);
  });

  it('fails when slot is after end', () => {
    expect(
      isSlotInDateRange(makeSlot('2026-07-01T10:00:00'), {
        dateRange: { start: '2026-04-01T00:00:00', end: '2026-06-01T00:00:00' },
      })
    ).toBe(false);
  });

  it('passes at exact start boundary', () => {
    expect(
      isSlotInDateRange(makeSlot('2026-04-01T00:00:00'), {
        dateRange: { start: '2026-04-01T00:00:00' },
      })
    ).toBe(true);
  });

  it('passes at exact end boundary', () => {
    expect(
      isSlotInDateRange(makeSlot('2026-06-01T00:00:00'), {
        dateRange: { end: '2026-06-01T00:00:00' },
      })
    ).toBe(true);
  });

  it('passes with only start bound when slot is after it', () => {
    expect(
      isSlotInDateRange(makeSlot('2026-05-01T10:00:00'), {
        dateRange: { start: '2026-04-01T00:00:00' },
      })
    ).toBe(true);
  });
});

// ─── isSlotInTimeRange — 6 cases ───────────────────────────────────────────

describe('isSlotInTimeRange', () => {
  it('passes when no time bounds are set', () => {
    expect(isSlotInTimeRange(makeSlot('2026-05-01T10:00:00'), { timeRange: {} })).toBe(true);
  });

  it('passes for slot time within [09:00:00, 17:00:00]', () => {
    expect(
      isSlotInTimeRange(makeSlot('2026-05-01T12:30:00'), {
        timeRange: { start: '09:00:00', end: '17:00:00' },
      })
    ).toBe(true);
  });

  it('fails for slot time before start', () => {
    expect(
      isSlotInTimeRange(makeSlot('2026-05-01T08:00:00'), {
        timeRange: { start: '09:00:00', end: '17:00:00' },
      })
    ).toBe(false);
  });

  it('fails for slot time after end', () => {
    expect(
      isSlotInTimeRange(makeSlot('2026-05-01T18:00:00'), {
        timeRange: { start: '09:00:00', end: '17:00:00' },
      })
    ).toBe(false);
  });

  it('midnight crossover NOT supported — documents string-comparison limitation', () => {
    // from=22:00, to=06:00, time=23:30 → logically inside the overnight window,
    // but the pure fn returns FALSE because '23:30:00' > '06:00:00' (string compare).
    // This test locks the current behavior as a known limitation.
    expect(
      isSlotInTimeRange(makeSlot('2026-05-01T23:30:00'), {
        timeRange: { start: '22:00:00', end: '06:00:00' },
      })
    ).toBe(false);
  });

  it('passes with only start bound when slot time is after it', () => {
    expect(
      isSlotInTimeRange(makeSlot('2026-05-01T10:00:00'), {
        timeRange: { start: '09:00:00' },
      })
    ).toBe(true);
  });
});

// ─── isDuplicate — 4 cases ─────────────────────────────────────────────────

describe('isDuplicate', () => {
  it('returns false when key is not in notifiedSlots', () => {
    expect(isDuplicate(makeSlot('2026-05-01T10:00:00'), {})).toBe(false);
  });

  it('returns true when key exists and was notified less than 24h ago', () => {
    vi.useFakeTimers();
    const now = Date.now();
    vi.setSystemTime(now);
    const notified = { '5020-2026-05-01T10:00:00': now - 60 * 60 * 1000 }; // 1h ago
    expect(isDuplicate(makeSlot('2026-05-01T10:00:00'), notified)).toBe(true);
  });

  it('returns false when key exists but was notified more than 24h ago', () => {
    vi.useFakeTimers();
    const now = Date.now();
    vi.setSystemTime(now);
    const notified = { '5020-2026-05-01T10:00:00': now - 25 * 60 * 60 * 1000 }; // 25h ago
    expect(isDuplicate(makeSlot('2026-05-01T10:00:00'), notified)).toBe(false);
  });

  it('handles multiple locations with the same timestamp correctly', () => {
    vi.useFakeTimers();
    const now = Date.now();
    vi.setSystemTime(now);
    const notified = { '9999-2026-05-01T10:00:00': now - 1000 }; // loc 9999 notified 1s ago
    // loc 5020 not in notified → not a duplicate
    expect(isDuplicate(makeSlot('2026-05-01T10:00:00', 5020), notified)).toBe(false);
    // loc 9999 in notified and within 24h → duplicate
    expect(isDuplicate(makeSlot('2026-05-01T10:00:00', 9999), notified)).toBe(true);
  });
});

// ─── pruneOldSlots — 3 cases ───────────────────────────────────────────────

describe('pruneOldSlots', () => {
  it('returns empty object for empty input', () => {
    expect(pruneOldSlots({})).toEqual({});
  });

  it('removes entries older than 24 hours', () => {
    vi.useFakeTimers();
    const now = Date.now();
    vi.setSystemTime(now);
    const notified = { 'old-slot': now - 25 * 60 * 60 * 1000 }; // 25h ago
    expect(pruneOldSlots(notified)).toEqual({});
  });

  it('keeps entries that are within 24 hours', () => {
    vi.useFakeTimers();
    const now = Date.now();
    vi.setSystemTime(now);
    const recent = now - 60 * 60 * 1000; // 1h ago
    const notified = { 'new-slot': recent };
    expect(pruneOldSlots(notified)).toEqual({ 'new-slot': recent });
  });
});
