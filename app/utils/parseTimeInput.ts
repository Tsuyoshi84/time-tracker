/**
 * Parses a time string in HH:MM format and returns a Date object.
 * @param timeString - The time string to parse (e.g., "14:30")
 * @returns A Date object with the parsed time, or null if invalid
 */
export function parseTimeInput(timeString: string): Date | null {
	const match = timeString.match(/^(\d{1,2}):(\d{2})$/)
	if (!match) return null

	const hours = Number.parseInt(match[1] as string, 10)
	const minutes = Number.parseInt(match[2] as string, 10)

	if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null

	const today = new Date()
	const result = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes)
	return result
}
