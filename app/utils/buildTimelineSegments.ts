import type { DateString, TimeSession } from '../types/index.ts'

const MINUTES_IN_DAY = 24 * 60

/** A positioned segment on a 24-hour day timeline. */
export interface TimelineSegment {
	/** Start position on the 24h axis (0–100). */
	leftPercent: number
	/** Segment width on the 24h axis (0–100). */
	widthPercent: number
	/** Clamped session start within the day. */
	startTime: Date
	/** Clamped session end within the day. */
	endTime: Date
}

/**
 * Returns midnight and end-of-day bounds for a calendar date.
 * @param dayDate - Date in YYYY-MM-DD format
 * @returns Start and end timestamps for the day
 */
function getDayBounds(dayDate: DateString): { dayStart: Date; dayEnd: Date } {
	const [year, month, day] = dayDate.split('-').map(Number)

	if (year === undefined || month === undefined || day === undefined) {
		throw new Error(`Invalid date string: ${dayDate}`)
	}

	const dayStart = new Date(year, month - 1, day, 0, 0, 0, 0)
	const dayEnd = new Date(year, month - 1, day, 23, 59, 59, 999)

	return { dayStart, dayEnd }
}

/**
 * Returns minutes elapsed since midnight for a given timestamp.
 * @param date - Timestamp to measure
 * @returns Minutes since midnight (0–1440)
 */
function getMinutesSinceMidnight(date: Date): number {
	return date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60 + date.getMilliseconds() / 60000
}

/**
 * Builds positioned timeline segments for completed sessions on a fixed 24-hour day.
 * Sessions crossing midnight are clamped to the day boundary.
 * @param sessions - Sessions for the day (active sessions are skipped)
 * @param dayDate - Calendar date in YYYY-MM-DD format
 * @returns Segments sorted by start time
 */
export function buildTimelineSegments(
	sessions: ReadonlyArray<TimeSession>,
	dayDate: DateString,
): TimelineSegment[] {
	const { dayStart, dayEnd } = getDayBounds(dayDate)
	const segments: TimelineSegment[] = []

	for (const session of sessions) {
		if (session.endTime === undefined) {
			continue
		}

		const segmentStart = session.startTime < dayStart ? dayStart : session.startTime
		const segmentEnd = session.endTime > dayEnd ? dayEnd : session.endTime

		if (segmentEnd.getTime() <= segmentStart.getTime()) {
			continue
		}

		const leftPercent = (getMinutesSinceMidnight(segmentStart) / MINUTES_IN_DAY) * 100
		const durationMs = segmentEnd.getTime() - segmentStart.getTime()
		const widthPercent = (durationMs / (MINUTES_IN_DAY * 60 * 1000)) * 100

		segments.push({
			leftPercent: Math.max(0, Math.min(100, leftPercent)),
			widthPercent: Math.max(0, Math.min(100 - leftPercent, widthPercent)),
			startTime: segmentStart,
			endTime: segmentEnd,
		})
	}

	return segments.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
}
