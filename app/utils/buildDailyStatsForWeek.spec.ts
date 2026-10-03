import { describe, expect, it } from 'vitest'

import type { TimeSession } from '../types/index.ts'
import { buildDailyStatsForWeek } from './buildDailyStatsForWeek.ts'
import { toMilliseconds } from './toMilliseconds.ts'

function createSession(id: number, date: TimeSession['date'], completed = true): TimeSession {
	const startTime = new Date(`${date}T09:00:00`)
	const endTime = completed ? new Date(`${date}T10:00:00`) : undefined

	return {
		id,
		date,
		startTime,
		endTime,
		duration: endTime ? toMilliseconds(endTime.getTime() - startTime.getTime()) : undefined,
		isActive: !completed,
		createdAt: startTime,
		updatedAt: startTime,
	}
}

describe('buildDailyStatsForWeek', () => {
	it('builds seven daily stats with completed durations and all session counts', () => {
		const sessions = [
			createSession(1, '2026-08-10'),
			createSession(2, '2026-08-10', false),
			createSession(3, '2026-08-16'),
			createSession(4, '2026-08-17'),
		]

		const stats = buildDailyStatsForWeek(sessions, '2026-08-10')

		expect(stats).toHaveLength(7)
		expect(stats[0]).toMatchObject({
			date: '2026-08-10',
			totalDuration: 60 * 60 * 1000,
			sessionCount: 2,
		})
		expect(stats[6]).toMatchObject({
			date: '2026-08-16',
			totalDuration: 60 * 60 * 1000,
			sessionCount: 1,
		})
	})
})
