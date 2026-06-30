import type { DateString } from '~/types/index.ts'

import { convertToDateString } from './convertToDateString.ts'

export interface DefaultSessionTimes {
	startTime: Date
	endTime: Date
}

/**
 * Returns sensible default start/end times for a new manual session.
 * Uses the current time when the selected date is today; otherwise noon on that day.
 * @param selectedDate - The date the user is viewing
 * @param now - Current timestamp (injected for testability)
 * @returns Default start and end times
 */
export function getDefaultSessionTimes(
	selectedDate: DateString,
	now: Date = new Date(),
): DefaultSessionTimes {
	const isToday = convertToDateString(now) === selectedDate
	const [year, month, day] = selectedDate.split('-').map(Number)

	if (year === undefined || month === undefined || day === undefined) {
		throw new Error('Invalid date string format')
	}

	const endTime = isToday ? now : new Date(year, month - 1, day, 12, 0, 0)

	const startTime = new Date(endTime.getTime() - 60 * 60 * 1000)

	return { startTime, endTime }
}
