/**
 * Parses a time string in HH:MM format and returns a Temporal.PlainDateTime object.
 * @param timeString - The time string to parse (e.g., "14:30")
 * @returns A Temporal.PlainDateTime object with the parsed time, or null if invalid
 */
import { Temporal } from '@js-temporal/polyfill'

export function parseTimeInput(timeString: string): Temporal.PlainDateTime | null {
	const match = timeString.match(/^(\d{1,2}):(\d{2})$/)
	if (!match) return null

	const hours = Number.parseInt(match[1] as string, 10)
	const minutes = Number.parseInt(match[2] as string, 10)

	if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null

	const today = Temporal.Now.plainDateISO()
	return Temporal.PlainDateTime.from({
		year: today.year,
		month: today.month,
		day: today.day,
		hour: hours,
		minute: minutes,
	})
}
