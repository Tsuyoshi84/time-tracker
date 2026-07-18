/**
 * Parses a time string in HH:MM format and returns a Date object.
 * @param timeString - The time string to parse (e.g., "14:30")
 * @param now - Time provider used to determine today's date
 * @returns A Date object with the parsed time, or null if invalid
 */
export function parseTimeInput(timeString: string, now: () => Date = () => new Date()): Date | null {
	const match = timeString.match(/^(\d{1,2}):(\d{2})$/)
	if (!match) return null

	const hoursStr = match[1]
	const minutesStr = match[2]
	if (hoursStr === undefined || minutesStr === undefined) return null

	const hours = Number.parseInt(hoursStr, 10)
	const minutes = Number.parseInt(minutesStr, 10)

	if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null

	const today = now()
	const result = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes)
	return result
}
