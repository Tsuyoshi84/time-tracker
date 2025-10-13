import type { Milliseconds } from '../types/index.ts'

/**
 * Calculates the difference between two dates in milliseconds.
 *
 * @param start - The start date
 * @param end - The end date
 * @returns The difference in milliseconds as a Milliseconds type
 *
 * @example
 * ```typescript
 * const start = new Date('2023-01-01T10:00:00Z')
 * const end = new Date('2023-01-01T11:30:00Z')
 * const diff = diffInMilliseconds(start, end)
 * console.log(diff) // 5400000 (90 minutes in milliseconds)
 * ```
 */
export function diffInMilliseconds(start: Date, end: Date): Milliseconds {
	return (end.getTime() - start.getTime()) as Milliseconds
}
