import type { Temporal } from '@js-temporal/polyfill'

/**
 * Calculates the duration between two Temporal.PlainDateTime objects in milliseconds.
 * @param startTime - The start time
 * @param endTime - The end time
 * @returns The duration in milliseconds (minimum 0)
 */
export function calculateDuration(
	startTime: Temporal.PlainDateTime,
	endTime: Temporal.PlainDateTime,
): number {
	const duration = endTime.since(startTime)
	return Math.max(0, duration.total({ unit: 'millisecond' }))
}
