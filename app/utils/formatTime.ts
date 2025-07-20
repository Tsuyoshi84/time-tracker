/**
 * Formats a Date object to a time string in 24-hour format.
 * @param date - The date to format
 * @returns A formatted time string in HH:MM format
 */
export function formatTime(date: Date): string {
	return date.toLocaleTimeString('en-US', {
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
	})
}
