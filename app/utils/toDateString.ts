import type { DateString } from '../types/index.ts'

/**
 * Converts a validated date string to the branded DateString type.
 * @param value - Date string in YYYY-MM-DD format
 * @returns Branded date string
 */
export function toDateString(value: string): DateString {
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- central branded type constructor
	return value as DateString
}
