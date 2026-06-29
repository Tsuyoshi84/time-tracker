import { describe, expect, it } from 'vitest'

import type { TimeSession } from '~/types/index.ts'

import { normalizeSessionUpdates } from './normalizeSessionUpdates'

describe('normalizeSessionUpdates', () => {
	const session = {
		id: 1,
		startTime: new Date('2023-06-15T09:00:00'),
		endTime: new Date('2023-06-15T10:00:00'),
		date: '2023-06-15',
		isActive: false,
		createdAt: new Date('2023-06-15T09:00:00'),
		updatedAt: new Date('2023-06-15T10:00:00'),
	} as TimeSession

	it('should return updates unchanged when times are not edited', () => {
		const updates = { isActive: false }

		expect(normalizeSessionUpdates(session, updates)).toEqual(updates)
	})

	it('should derive date and duration when times change', () => {
		const startTime = new Date('2023-06-14T22:00:00')
		const endTime = new Date('2023-06-15T01:00:00')

		expect(normalizeSessionUpdates(session, { startTime, endTime })).toEqual({
			startTime,
			endTime,
			date: '2023-06-14',
			duration: endTime.getTime() - startTime.getTime(),
		})
	})
})
