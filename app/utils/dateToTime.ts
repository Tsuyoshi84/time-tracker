import { Time } from '@internationalized/date'

/**
 * Extracts the local time portion from a JavaScript Date.
 * @param date - The date to convert
 * @returns A Time representing hours and minutes
 */
export function dateToTime(date: Date): Time {
	return new Time(date.getHours(), date.getMinutes())
}
