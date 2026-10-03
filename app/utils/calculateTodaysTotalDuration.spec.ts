import { describe, expect, it } from 'vitest'

import type { TimeSession } from '../types/index.ts'
import { calculateTodaysTotalDuration } from './calculateTodaysTotalDuration.ts'
import { toMilliseconds } from './toMilliseconds.ts'

describe('calculateTodaysTotalDuration', () => {
	it("includes today's completed sessions and the running session duration", () => {
		const sessions: TimeSession[] = [
			{
				id: 1,
				startTime: new Date('2026-10-03T09:00:00'),
				endTime: new Date('2026-10-03T10:00:00'),
				date: '2026-10-03',
				isActive: false,
				createdAt: new Date('2026-10-03T09:00:00'),
				updatedAt: new Date('2026-10-03T10:00:00'),
			},
			{
				id: 2,
				startTime: new Date('2026-10-03T10:00:00'),
				date: '2026-10-03',
				isActive: true,
				createdAt: new Date('2026-10-03T10:00:00'),
				updatedAt: new Date('2026-10-03T10:00:00'),
			},
			{
				id: 3,
				startTime: new Date('2026-10-02T09:00:00'),
				endTime: new Date('2026-10-02T10:00:00'),
				date: '2026-10-02',
				isActive: false,
				createdAt: new Date('2026-10-02T09:00:00'),
				updatedAt: new Date('2026-10-02T10:00:00'),
			},
		]

		expect(
			calculateTodaysTotalDuration(sessions, '2026-10-03', toMilliseconds(30 * 60 * 1000)),
		).toBe(90 * 60 * 1000)
	})
})
