import { convertToDateString } from './convertToDateString.ts'
import { formatDate } from './formatDate.ts'
import { formatTime } from './formatTime.ts'

/**
 * Formats a session time range for display in the session list.
 * Same-day sessions show times only; cross-day sessions include dates.
 * @param startTime - Session start
 * @param endTime - Session end
 * @returns A human-readable time range string
 */
export function formatSessionTimeRange(startTime: Date, endTime: Date): string {
	const sameDay = convertToDateString(startTime) === convertToDateString(endTime)

	if (sameDay) {
		return `${formatTime(startTime)} – ${formatTime(endTime)}`
	}

	return `${formatDate(startTime)}, ${formatTime(startTime)} – ${formatDate(endTime)}, ${formatTime(endTime)}`
}
