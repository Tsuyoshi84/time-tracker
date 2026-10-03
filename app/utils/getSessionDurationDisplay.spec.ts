import { describe, expect, it } from 'vitest'

import type { TimeSession } from '../types/index.ts'
import { getSessionDurationDisplay } from './getSessionDurationDisplay.ts'

function createSession(overrides: Partial<TimeSession> = {}): TimeSession {
	const startTime = new Date('2026-10-03T09:00:00')

	return {
		id: 1,
		startTime,
		endTime: new Date('2026-10-03T10:00:00'),
		date: '2026-10-03',
		isActive: false,
		createdAt: startTime,
		updatedAt: startTime,
		...overrides,
	}
}

describe('getSessionDurationDisplay', () => {
	it('formats completed session durations', () => {
		expect(getSessionDurationDisplay(createSession())).toBe('1:00:00')
	})

	it('shows a running label for active sessions', () => {
		expect(getSessionDurationDisplay(createSession({ isActive: true, endTime: undefined }))).toBe(
			'Running...',
		)
	})

	it('shows a placeholder when an inactive session has no end time', () => {
		expect(getSessionDurationDisplay(createSession({ endTime: undefined }))).toBe('--:--:--')
	})
})
