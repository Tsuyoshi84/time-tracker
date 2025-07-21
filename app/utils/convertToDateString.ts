import type { DateString } from '../types/index.ts'

/**
 * Converts a Date object to a DateString format (YYYY-MM-DD).
 * @param date - The date to convert
 * @returns A date string in YYYY-MM-DD format
 */
export function convertToDateString(date: Date): DateString {
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` as DateString
}
