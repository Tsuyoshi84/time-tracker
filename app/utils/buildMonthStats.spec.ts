import { describe, expect, it } from 'vitest'

import type { DateString, TimeSession } from '../types/index.ts'
import {
	buildDailyStatsForMonth,
	buildMonthStats,
	buildVisibleMonthStats,
	MIN_SESSIONS_PER_MONTH,
} from './buildMonthStats.ts'
import { toMilliseconds, ZERO_MILLISECONDS } from './toMilliseconds.ts'

function createSession(
	id: number,
	date: DateString,
	options: { isActive?: boolean; endTime?: Date; startTime?: Date } = {},
): TimeSession {
	const startTime = options.startTime ?? new Date(`${date}T09:00:00`)
	const endTime =
		options.endTime ??
		(options.isActive === true ? undefined : new Date(`${date}T10:00:00`))

	return {
		id,
		date,
		startTime,
		endTime,
		isActive: options.isActive ?? false,
		duration: endTime ? toMilliseconds(endTime.getTime() - startTime.getTime()) : ZERO_MILLISECONDS,
		createdAt: startTime,
		updatedAt: startTime,
	}
}

describe('buildMonthStats', () => {
	it('includes a month with two completed sessions', () => {
		const sessions = [
			createSession(1, '2026-08-10'),
			createSession(2, '2026-08-15'),
		]

		const stats = buildMonthStats(sessions)

		expect(stats).toHaveLength(1)
		expect(stats[0]?.startDate).toBe('2026-08-01')
		expect(stats[0]?.sessionCount).toBe(2)
	})

	it('groups sessions by start time month when the stored date field differs', () => {
		const sessions = [
			createSession(1, '2026-07-31', {
				startTime: new Date(2026, 7, 1, 9, 0, 0),
			}),
			createSession(2, '2026-08-15'),
		]

		const stats = buildMonthStats(sessions)

		expect(stats).toHaveLength(1)
		expect(stats[0]?.startDate).toBe('2026-08-01')
		expect(stats[0]?.sessionCount).toBe(2)
	})

	it('includes a month with one completed and one active session', () => {
		const sessions = [
			createSession(1, '2026-08-10'),
			createSession(2, '2026-08-15', { isActive: true }),
		]

		const visibleMonths = buildVisibleMonthStats(sessions, new Date(2026, 7, 20))

		expect(visibleMonths).toHaveLength(1)
		expect(visibleMonths[0]?.startDate).toBe('2026-08-01')
	})

	it('excludes a past month with only one session', () => {
		const sessions = [createSession(1, '2026-08-10')]

		const visibleMonths = buildVisibleMonthStats(sessions, new Date(2026, 8, 1))

		expect(visibleMonths).toHaveLength(0)
	})

	it('includes the current month when it has one session', () => {
		const sessions = [createSession(1, '2026-08-10')]

		const visibleMonths = buildVisibleMonthStats(sessions, new Date(2026, 7, 20))

		expect(visibleMonths).toHaveLength(1)
		expect(visibleMonths[0]?.startDate).toBe('2026-08-01')
	})

	it('requires at least two sessions for past months to become visible', () => {
		expect(MIN_SESSIONS_PER_MONTH).toBe(2)
	})
})

describe('buildDailyStatsForMonth', () => {
	it('includes every calendar day in the month', () => {
		const sessions = [createSession(1, '2026-08-15')]

		const stats = buildDailyStatsForMonth(sessions, '2026-08-01', '2026-08-31')

		expect(stats).toHaveLength(31)
		expect(stats[0]?.date).toBe('2026-08-01')
		expect(stats[30]?.date).toBe('2026-08-31')
	})

	it('uses local calendar dates without timezone drift', () => {
		const sessions: TimeSession[] = []

		const stats = buildDailyStatsForMonth(sessions, '2026-08-01', '2026-08-03')

		expect(stats.map((day) => day.date)).toEqual(['2026-08-01', '2026-08-02', '2026-08-03'])
	})

	it('places sessions on the day derived from start time', () => {
		const sessions = [
			createSession(1, '2026-07-31', {
				startTime: new Date(2026, 7, 1, 9, 0, 0),
			}),
		]

		const dayStats = buildDailyStatsForMonth(sessions, '2026-08-01', '2026-08-31').find(
			(day) => day.date === '2026-08-01',
		)

		expect(dayStats?.sessionCount).toBe(1)
	})

	it('counts completed duration while including active sessions in the day list', () => {
		const sessions = [
			createSession(1, '2026-08-15'),
			createSession(2, '2026-08-15', { isActive: true }),
		]

		const dayStats = buildDailyStatsForMonth(sessions, '2026-08-01', '2026-08-31').find(
			(day) => day.date === '2026-08-15',
		)

		expect(dayStats?.sessionCount).toBe(2)
		expect(dayStats?.totalDuration).toBeGreaterThan(0)
	})
})
