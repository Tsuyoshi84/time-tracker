import type { DateString, DayStats, Milliseconds, MonthStats, TimeSession } from '../types/index.ts'
import { calendarDateToDateString } from './calendarDateToDateString.ts'
import { convertToDateString } from './convertToDateString.ts'
import { dateStringToCalendarDate } from './dateStringToCalendarDate.ts'
import { diffInMilliseconds } from './diffInMilliseconds.ts'
import { toMilliseconds, ZERO_MILLISECONDS } from './toMilliseconds.ts'

/** Minimum number of sessions required for a past month to appear in the list. */
export const MIN_SESSIONS_PER_MONTH = 2

/**
 * Returns the YYYY-MM month key for a session start time.
 * @param startTime - Session start timestamp
 * @returns Month key such as "2026-08"
 */
function getSessionMonthKey(startTime: Date): string {
	return `${startTime.getFullYear()}-${String(startTime.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Builds month-level statistics grouped by the session start time month.
 * @param sessions - All sessions in the database
 * @returns Month stats sorted newest first
 */
// fallow-ignore-next-line complexity
export function buildMonthStats(sessions: ReadonlyArray<TimeSession>): MonthStats[] {
	const sessionsByMonth = new Map<string, TimeSession[]>()

	for (const session of sessions) {
		const monthKey = getSessionMonthKey(session.startTime)
		const monthSessions = sessionsByMonth.get(monthKey) ?? []
		monthSessions.push(session)
		sessionsByMonth.set(monthKey, monthSessions)
	}

	const stats: MonthStats[] = []

	for (const [monthKey, monthSessions] of sessionsByMonth) {
		const [year, month] = monthKey.split('-').map(Number)

		if (year === undefined || month === undefined) {
			continue
		}

		const monthDate = new Date(year, month - 1, 1)
		const startDate = convertToDateString(getStartOfMonth(monthDate))
		const endDate = convertToDateString(getEndOfMonth(monthDate))
		const completedSessions = monthSessions.filter((session) => session.endTime !== undefined)
		const totalDuration = completedSessions.reduce<Milliseconds>((total, session) => {
			if (session.endTime !== undefined) {
				return toMilliseconds(total + diffInMilliseconds(session.startTime, session.endTime))
			}

			return total
		}, ZERO_MILLISECONDS)

		stats.push({
			monthLabel: monthDate.toLocaleDateString('en-US', {
				month: 'long',
				year: 'numeric',
			}),
			startDate,
			endDate,
			totalDuration,
			sessionCount: monthSessions.length,
		})
	}

	return stats.sort((a, b) => b.startDate.localeCompare(a.startDate))
}

/**
 * Returns months visible in the monthly view.
 * Past months need at least two sessions; the current calendar month appears with one or more.
 * @param sessions - All sessions in the database
 * @param now - Current timestamp used to identify the current month
 * @returns Filtered month stats sorted newest first
 */
export function buildVisibleMonthStats(
	sessions: ReadonlyArray<TimeSession>,
	now: Date = new Date(),
): MonthStats[] {
	const currentMonthStart = convertToDateString(getStartOfMonth(now))

	return buildMonthStats(sessions).filter(
		(month) =>
			month.sessionCount >= MIN_SESSIONS_PER_MONTH || month.startDate === currentMonthStart,
	)
}

/**
 * Builds daily statistics for every calendar day in a month.
 * Sessions are placed by their start time day.
 * @param sessions - All sessions in the database
 * @param startDate - First day of the month
 * @param endDate - Last day of the month
 * @returns Daily stats in chronological order
 */
// fallow-ignore-next-line complexity
export function buildDailyStatsForMonth(
	sessions: ReadonlyArray<TimeSession>,
	startDate: DateString,
	endDate: DateString,
): DayStats[] {
	const sessionsByDate = new Map<DateString, TimeSession[]>()

	for (const session of sessions) {
		const dayKey = convertToDateString(session.startTime)

		if (dayKey < startDate || dayKey > endDate) {
			continue
		}

		const daySessions = sessionsByDate.get(dayKey) ?? []
		daySessions.push(session)
		sessionsByDate.set(dayKey, daySessions)
	}

	const stats: DayStats[] = []
	let currentDate = dateStringToCalendarDate(startDate)
	const lastDate = dateStringToCalendarDate(endDate)

	while (currentDate.compare(lastDate) <= 0) {
		const dateStr = calendarDateToDateString(currentDate)
		const daySessions = sessionsByDate.get(dateStr) ?? []
		const completedSessions = daySessions.filter((session) => session.endTime !== undefined)
		const totalDuration = completedSessions.reduce<Milliseconds>((total, session) => {
			if (session.endTime !== undefined) {
				return toMilliseconds(total + diffInMilliseconds(session.startTime, session.endTime))
			}

			return total
		}, ZERO_MILLISECONDS)

		stats.push({
			date: dateStr,
			totalDuration,
			sessionCount: daySessions.length,
			sessions: daySessions.sort((a, b) => a.startTime.getTime() - b.startTime.getTime()),
		})

		currentDate = currentDate.add({ days: 1 })
	}

	return stats
}

function getStartOfMonth(date: Date): Date {
	const result = new Date(date.getFullYear(), date.getMonth(), 1)
	result.setHours(0, 0, 0, 0)
	return result
}

function getEndOfMonth(date: Date): Date {
	const result = new Date(date.getFullYear(), date.getMonth() + 1, 0)
	result.setHours(23, 59, 59, 999)
	return result
}
