import type { Temporal } from '@js-temporal/polyfill'

/**
 * Formats a Temporal.PlainDateTime object to a time string in 24-hour format.
 * @param dateTime - The Temporal.PlainDateTime to format
 * @returns A formatted time string in HH:MM format
 */
export function formatTime(dateTime: Temporal.PlainDateTime): string {
	const hour = String(dateTime.hour).padStart(2, '0')
	const minute = String(dateTime.minute).padStart(2, '0')
	return `${hour}:${minute}`
}
