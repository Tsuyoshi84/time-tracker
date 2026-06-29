import { CalendarDate } from '@internationalized/date'

/**
 * Converts a JavaScript Date to a CalendarDate (date portion only).
 * @param date - The date to convert
 * @returns A CalendarDate representing the local date
 */
export function dateToCalendarDate(date: Date): CalendarDate {
	return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
}
