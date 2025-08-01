/**
 * Formats a date to a localized short format.
 *
 * @param date - The date to format
 * @returns A formatted date string in "MMM d" format (e.g., "Jan 15")
 */
export function formatDate(date: Date): string {
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
	})
}
