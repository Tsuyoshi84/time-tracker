import type { Temporal } from '@js-temporal/polyfill'
import type { DateString } from '../types/index.ts'

/**
 * Converts a Temporal.PlainDate object to a DateString format (YYYY-MM-DD).
 * @param date - The Temporal.PlainDate to convert
 * @returns A date string in YYYY-MM-DD format
 * @example
 * ```ts
 * import { Temporal } from '@js-temporal/polyfill'
 * const date = Temporal.PlainDate.from('2025-07-30')
 * const str = convertToDateString(date) // '2025-07-30'
 * ```
 */
export function convertToDateString(date: Temporal.PlainDate): DateString {
	return date.toString() as DateString
}
