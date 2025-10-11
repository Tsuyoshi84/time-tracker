import type { CalendarDate } from '@internationalized/date'
import type { DateString } from '~/types/index.ts'

/**
 * Converts a CalendarDate to a DateString in YYYY-MM-DD format.
 *
 * @param date - The CalendarDate to convert
 * @returns A DateString in YYYY-MM-DD format with zero-padded month and day
 *
 * @example
 * ```typescript
 * const date = new CalendarDate(2023, 1, 15)
 * const result = calendarDateToDateString(date)
 * // Returns: "2023-01-15"
 * ```
 */
export function calendarDateToDateString(date: CalendarDate): DateString {
	return `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}` as DateString
}
