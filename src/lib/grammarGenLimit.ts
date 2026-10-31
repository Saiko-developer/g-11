/** Per-exercise daily generation cap for grammar "More practice" (resets at Myanmar midnight). */
export const GRAMMAR_GEN_DAILY_LIMIT = 2;

/** Myanmar (UTC+6:30) calendar date as YYYY-MM-DD. */
export function mmDate(now: Date = new Date()): string {
  return new Date(now.getTime() + 6.5 * 3600_000).toISOString().slice(0, 10);
}

export type GenState<T> = { date: string; count: number; items: T[] };

export function remainingGenerations(count: number): number {
  return Math.max(0, GRAMMAR_GEN_DAILY_LIMIT - count);
}

/** Returns today's state; a state from an earlier Myanmar day resets the count but keeps items. */
export function normalizeState<T>(s: GenState<T> | null, today = mmDate()): GenState<T> {
  if (!s) return { date: today, count: 0, items: [] };
  return s.date === today ? s : { date: today, count: 0, items: s.items ?? [] };
}
