/**
 * Calculates the duration between two dates in milliseconds.
 * @param startTime - The start time
 * @param endTime - The end time
 * @returns The duration in milliseconds (minimum 0)
 */
export function calculateDuration(startTime: Date, endTime: Date): number {
	return Math.max(0, endTime.getTime() - startTime.getTime())
}
