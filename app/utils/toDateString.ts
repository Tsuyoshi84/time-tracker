import type { DateString } from '../types/index.ts'

const DATE_STRING_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/**
 * Converts a validated date string to the branded DateString type.
 * @param value - Date string in YYYY-MM-DD format
 * @returns Branded date string
 */
export function toDateString(value: string): DateString {
	if (!DATE_STRING_PATTERN.test(value)) {
		throw new Error(`Invalid DateString format: ${value}`)
	}
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- central branded type constructor
	return value as DateString
}
