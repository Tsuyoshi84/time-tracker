import { describe, expect, it } from 'vitest'

import type { TimeSession } from '../types/index.ts'
import { sumCompletedSessionDuration } from './sumCompletedSessionDuration.ts'

function createSession(startTime: Date, endTime?: Date): TimeSession {
	return {
		id: 1,
		date: '2026-08-15',
		startTime,
		endTime,
		isActive: endTime === undefined,
		duration: undefined,
		createdAt: startTime,
		updatedAt: startTime,
	}
}

describe('sumCompletedSessionDuration', () => {
	it('sums completed sessions and ignores active sessions', () => {
		const sessions = [
			createSession(new Date('2026-08-15T09:00:00'), new Date('2026-08-15T10:00:00')),
			createSession(new Date('2026-08-15T10:00:00')),
			createSession(new Date('2026-08-15T11:00:00'), new Date('2026-08-15T11:30:00')),
		]

		expect(sumCompletedSessionDuration(sessions)).toBe(90 * 60 * 1000)
	})

	it('returns zero when there are no completed sessions', () => {
		const sessions = [createSession(new Date('2026-08-15T09:00:00'))]

		expect(sumCompletedSessionDuration(sessions)).toBe(0)
	})
})
