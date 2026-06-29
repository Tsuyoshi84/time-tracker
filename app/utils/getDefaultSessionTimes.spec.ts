import { describe, expect, it } from 'vitest'

import type { DateString } from '~/types/index.ts'

import { getDefaultSessionTimes } from './getDefaultSessionTimes'

describe('getDefaultSessionTimes', () => {
	it('should default to one hour ending at now when selected date is today', () => {
		const now = new Date('2023-06-15T14:30:00')
		const selectedDate = '2023-06-15' as DateString

		const { startTime, endTime } = getDefaultSessionTimes(selectedDate, now)

		expect(endTime).toEqual(now)
		expect(startTime.getTime()).toBe(now.getTime() - 60 * 60 * 1000)
	})

	it('should default to 11:00–12:00 when selected date is not today', () => {
		const now = new Date('2023-06-15T14:30:00')
		const selectedDate = '2023-06-10' as DateString

		const { startTime, endTime } = getDefaultSessionTimes(selectedDate, now)

		expect(endTime.getHours()).toBe(12)
		expect(endTime.getMinutes()).toBe(0)
		expect(startTime.getHours()).toBe(11)
		expect(startTime.getMinutes()).toBe(0)
		expect(endTime.getFullYear()).toBe(2023)
		expect(endTime.getMonth()).toBe(5)
		expect(endTime.getDate()).toBe(10)
	})
})
