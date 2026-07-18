import { CalendarDate, Time } from '@internationalized/date'

interface CalendarDateFields {
	year: number
	month: number
	day: number
}

interface TimeFields {
	hour: number
	minute: number
	second: number
}

/**
 * Reads a numeric property from an object when present.
 * @param obj - Object to read from
 * @param key - Property name
 * @returns Numeric value or undefined
 */
function getNumberProperty(obj: object, key: string): number | undefined {
	if (!(key in obj)) return undefined
	const value: unknown = Object.getOwnPropertyDescriptor(obj, key)?.value
	return typeof value === 'number' ? value : undefined
}

/**
 * Checks whether a value contains calendar date fields.
 * @param value - Value to inspect
 * @returns Whether the value has year, month, and day numbers
 */
function hasCalendarDateFields(value: object): value is CalendarDateFields {
	const year = getNumberProperty(value, 'year')
	const month = getNumberProperty(value, 'month')
	const day = getNumberProperty(value, 'day')
	return year !== undefined && month !== undefined && day !== undefined
}

/**
 * Checks whether a value contains time fields.
 * @param value - Value to inspect
 * @returns Whether the value has hour, minute, and second numbers
 */
function hasTimeFields(value: object): value is TimeFields {
	const hour = getNumberProperty(value, 'hour')
	const minute = getNumberProperty(value, 'minute')
	const second = getNumberProperty(value, 'second')
	return hour !== undefined && minute !== undefined && second !== undefined
}

/**
 * Parses an unknown value from UInputDate into a CalendarDate.
 * @param value - Raw model value from the date input
 * @returns Parsed calendar date, or null when invalid
 */
export function parseCalendarInput(value: unknown): CalendarDate | null {
	if (typeof value !== 'object' || value === null) return null
	if (!hasCalendarDateFields(value)) return null

	const { year, month, day } = value
	return new CalendarDate(year, month, day)
}

/**
 * Parses an unknown value from UInputTime into a Time.
 * @param value - Raw model value from the time input
 * @returns Parsed time, or null when invalid
 */
export function parseTimeInputValue(value: unknown): Time | null {
	if (typeof value !== 'object' || value === null) return null
	if (!hasTimeFields(value)) return null

	const { hour, minute, second } = value
	return new Time(hour, minute, second)
}
