import type { DateString } from '../types/index.ts'

/**
 * Converts a Date object to a DateString format (YYYY-MM-DD).
 * @param date - The date to convert
 * @returns A date string in YYYY-MM-DD format
 */
export function convertToDateString(date: Date): DateString {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` as DateString
}
