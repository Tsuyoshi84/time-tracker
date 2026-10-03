import type { DateString, DayStats, TimeSession } from '../types/index.ts'
import { calendarDateToDateString } from './calendarDateToDateString.ts'
import { dateStringToCalendarDate } from './dateStringToCalendarDate.ts'
import { sumCompletedSessionDuration } from './sumCompletedSessionDuration.ts'

export function buildDailyStatsForWeek(
	sessions: ReadonlyArray<TimeSession>,
	startDate: DateString,
): DayStats[] {
	const firstDate = dateStringToCalendarDate(startDate)
	const lastDate = firstDate.add({ days: 6 })
	const sessionsByDate = new Map<DateString, TimeSession[]>()

	for (const session of sessions) {
		if (session.date < startDate || session.date > calendarDateToDateString(lastDate)) {
			continue
		}

		const daySessions = sessionsByDate.get(session.date) ?? []
		daySessions.push(session)
		sessionsByDate.set(session.date, daySessions)
	}

	const stats: DayStats[] = []
	let currentDate = firstDate

	while (currentDate.compare(lastDate) <= 0) {
		const date = calendarDateToDateString(currentDate)
		const daySessions = sessionsByDate.get(date) ?? []

		stats.push({
			date,
			totalDuration: sumCompletedSessionDuration(daySessions),
			sessionCount: daySessions.length,
			sessions: daySessions,
		})

		currentDate = currentDate.add({ days: 1 })
	}

	return stats
}
