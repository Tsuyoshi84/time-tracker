import { CalendarDate, Time } from '@internationalized/date'

/**
 * Parses an unknown value from UInputDate into a CalendarDate.
 * @param value - Raw model value from the date input
 * @returns Parsed calendar date, or null when invalid
 */
export function parseCalendarInput(value: unknown): CalendarDate | null {
	if (typeof value !== 'object' || value === null) return null
	if (!('year' in value) || !('month' in value) || !('day' in value)) return null

	const { year, month, day } = value as { year: number; month: number; day: number }
	return new CalendarDate(year, month, day)
}

/**
 * Parses an unknown value from UInputTime into a Time.
 * @param value - Raw model value from the time input
 * @returns Parsed time, or null when invalid
 */
export function parseTimeInputValue(value: unknown): Time | null {
	if (typeof value !== 'object' || value === null) return null
	if (!('hour' in value) || !('minute' in value) || !('second' in value)) return null

	const { hour, minute, second } = value as { hour: number; minute: number; second: number }
	return new Time(hour, minute, second)
}
