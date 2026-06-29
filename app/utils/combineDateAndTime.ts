import type { CalendarDate, Time } from '@internationalized/date'

/**
 * Combines a CalendarDate and Time into a JavaScript Date in local time.
 * @param date - The calendar date
 * @param time - The time of day
 * @returns A Date with the combined date and time
 */
export function combineDateAndTime(date: CalendarDate, time: Time): Date {
	return new Date(date.year, date.month - 1, date.day, time.hour, time.minute, time.second)
}
