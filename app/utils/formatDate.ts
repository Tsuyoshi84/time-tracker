import type { Temporal } from '@js-temporal/polyfill'

/**
 * Formats a Temporal.PlainDate as 'MMM D' (e.g., 'Jul 30').
 * @param date - The Temporal.PlainDate to format
 */
export function formatDate(date: Temporal.PlainDate): string {
	const month = date.toLocaleString('en-US', { month: 'short' })
	return `${month} ${date.day}`
}
