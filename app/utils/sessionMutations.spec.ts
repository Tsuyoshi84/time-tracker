import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { TimeSession } from '~/types/index.ts'

import { checkForOverlappingSessions, updateSession } from './database.ts'
import { assertNoOverlappingSessions, persistSessionUpdate } from './sessionMutations'

vi.mock('./database.ts', () => ({
	checkForOverlappingSessions:
		vi.fn<(startTime: Date, endTime: Date, excludeId?: number) => Promise<TimeSession[]>>(),
	updateSession: vi.fn<(id: number, updates: Partial<TimeSession>) => Promise<void>>(),
}))

const endTime = new Date('2023-06-15T10:00:00')
const session: TimeSession = {
	id: 1,
	startTime: new Date('2023-06-15T09:00:00'),
	endTime,
	date: '2023-06-15',
	isActive: false,
	createdAt: new Date('2023-06-15T09:00:00'),
	updatedAt: endTime,
}

describe('assertNoOverlappingSessions', () => {
	beforeEach(() => {
		vi.mocked(checkForOverlappingSessions).mockReset()
	})

	it('should pass when no sessions overlap', async () => {
		vi.mocked(checkForOverlappingSessions).mockResolvedValue([])

		await expect(
			assertNoOverlappingSessions(session.startTime, endTime, session.id),
		).resolves.toBeUndefined()
	})

	it('should throw when sessions overlap', async () => {
		vi.mocked(checkForOverlappingSessions).mockResolvedValue([session])

		await expect(
			assertNoOverlappingSessions(session.startTime, endTime, session.id),
		).rejects.toThrow('This time range overlaps with existing sessions')
	})
})

describe('persistSessionUpdate', () => {
	beforeEach(() => {
		vi.mocked(checkForOverlappingSessions).mockReset()
		vi.mocked(checkForOverlappingSessions).mockResolvedValue([])
		vi.mocked(updateSession).mockReset()
		vi.mocked(updateSession).mockResolvedValue()
	})

	it('should skip overlap validation when times are unchanged', async () => {
		await persistSessionUpdate(session, { isActive: false })

		expect(checkForOverlappingSessions).not.toHaveBeenCalled()
		expect(updateSession).toHaveBeenCalledWith(session.id, { isActive: false })
	})

	it('should validate overlap when times change', async () => {
		const startTime = new Date('2023-06-15T08:00:00')

		await persistSessionUpdate(session, { startTime })

		expect(checkForOverlappingSessions).toHaveBeenCalledWith(startTime, session.endTime, session.id)
	})

	it('should validate overlap using current time when active session start time changes', async () => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date('2023-06-15T10:00:00'))

		const activeSession = { ...session, isActive: true, endTime: undefined }
		const startTime = new Date('2023-06-15T08:00:00')

		await persistSessionUpdate(activeSession, { startTime })

		expect(checkForOverlappingSessions).toHaveBeenCalledWith(
			startTime,
			new Date('2023-06-15T10:00:00'),
			activeSession.id,
		)

		vi.useRealTimers()
	})
})
