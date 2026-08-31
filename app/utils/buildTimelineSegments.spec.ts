import { describe, expect, it } from 'vitest'

import type { DateString, TimeSession } from '../types/index.ts'
import { buildTimelineSegments } from './buildTimelineSegments.ts'

function createSession(
	id: number,
	date: DateString,
	startHour: number,
	startMinute: number,
	endHour: number,
	endMinute: number,
): TimeSession {
	return {
		id,
		date,
		isActive: false,
		startTime: new Date(2024, 5, 15, startHour, startMinute, 0, 0),
		endTime: new Date(2024, 5, 15, endHour, endMinute, 0, 0),
		createdAt: new Date(),
		updatedAt: new Date(),
	}
}

describe('buildTimelineSegments', () => {
	const dayDate = '2024-06-15' as DateString

	it('returns an empty array when there are no sessions', () => {
		expect(buildTimelineSegments([], dayDate)).toEqual([])
	})

	it('skips active sessions without an end time', () => {
		const activeSession: TimeSession = {
			...createSession(1, dayDate, 9, 0, 12, 0),
			endTime: undefined,
			isActive: true,
		}

		expect(buildTimelineSegments([activeSession], dayDate)).toEqual([])
	})

	it('positions a single session on the 24-hour axis', () => {
		const session = createSession(1, dayDate, 9, 0, 12, 0)
		const segments = buildTimelineSegments([session], dayDate)

		expect(segments).toHaveLength(1)
		expect(segments[0]?.leftPercent).toBeCloseTo(37.5, 1)
		expect(segments[0]?.widthPercent).toBeCloseTo(12.5, 1)
	})

	it('builds separate segments for multiple sessions', () => {
		const sessions = [
			createSession(1, dayDate, 9, 0, 11, 0),
			createSession(2, dayDate, 14, 0, 16, 0),
		]
		const segments = buildTimelineSegments(sessions, dayDate)

		expect(segments).toHaveLength(2)
		expect(segments[0]?.leftPercent).toBeCloseTo(37.5, 1)
		expect(segments[1]?.leftPercent).toBeCloseTo(58.333, 1)
	})

	it('clamps sessions that start before midnight', () => {
		const session = createSession(1, dayDate, 0, 0, 2, 0)
		const segments = buildTimelineSegments([session], dayDate)

		expect(segments[0]?.leftPercent).toBe(0)
		expect(segments[0]?.widthPercent).toBeCloseTo(8.333, 1)
	})

	it('clamps sessions that end after midnight', () => {
		const session: TimeSession = {
			...createSession(1, dayDate, 22, 0, 23, 59),
			endTime: new Date(2024, 5, 15, 23, 59, 59, 999),
		}
		const segments = buildTimelineSegments([session], dayDate)

		expect(segments).toHaveLength(1)
		expect(segments[0]?.leftPercent).toBeCloseTo(91.667, 1)
		expect(segments[0]?.widthPercent).toBeGreaterThan(0)
		expect(segments[0]?.widthPercent).toBeLessThanOrEqual(8.334)
	})
})
