import { Temporal } from '@js-temporal/polyfill'
import { describe, expect, it } from 'vitest'
import { formatTime } from './formatTime'

describe('formatTime', () => {
	it('should format time in 24-hour format', () => {
		const date1 = Temporal.PlainDateTime.from('2023-01-01T09:30:00')
		const date2 = Temporal.PlainDateTime.from('2023-01-01T14:45:00')
		const date3 = Temporal.PlainDateTime.from('2023-01-01T23:59:00')

		expect(formatTime(date1)).toBe('09:30')
		expect(formatTime(date2)).toBe('14:45')
		expect(formatTime(date3)).toBe('23:59')
	})

	it('should handle midnight and noon', () => {
		const midnight = Temporal.PlainDateTime.from('2023-01-01T00:00:00')
		const noon = Temporal.PlainDateTime.from('2023-01-01T12:00:00')

		expect(formatTime(midnight)).toBe('00:00')
		expect(formatTime(noon)).toBe('12:00')
	})

	it('should handle single digit hours and minutes', () => {
		const earlyMorning = Temporal.PlainDateTime.from('2023-01-01T05:05:00')
		const lateNight = Temporal.PlainDateTime.from('2023-01-01T23:09:00')

		expect(formatTime(earlyMorning)).toBe('05:05')
		expect(formatTime(lateNight)).toBe('23:09')
	})
})
