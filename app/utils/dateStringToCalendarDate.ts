import { CalendarDate } from '@internationalized/date'
import type { DateString } from '~/types/index.ts'

/**
 * Converts a date string in YYYY-MM-DD format to a CalendarDate object.
 *
 * This function efficiently parses date strings by directly extracting year, month, and day
 * components using string slicing, avoiding array operations for better performance.
 *
 * @param dateString - A date string in YYYY-MM-DD format (e.g., "2023-12-25")
 * @returns A CalendarDate object representing the parsed date
 * @throws {Error} When the date string format is invalid or contains non-numeric values
 *
 * @example
 * ```
 * const date = dateStringToCalendarDate('2023-12-25')
 * console.log(date.year)  // 2023
 * console.log(date.month) // 12
 * console.log(date.day)   // 25
 * ```
 *
 * @example
 * ```
 * // Error handling
 * try {
 *   dateStringToCalendarDate('invalid-date')
 * } catch (error) {
 *   console.error(error.message) // "Invalid date string format"
 * }
 * ```
 */
export function dateStringToCalendarDate(dateString: DateString): CalendarDate {
	const year = Number.parseInt(dateString.slice(0, 4), 10)
	const month = Number.parseInt(dateString.slice(5, 7), 10)
	const day = Number.parseInt(dateString.slice(8, 10), 10)

	if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
		throw new Error('Invalid date string format')
	}

	return new CalendarDate(year, month, day)
}
