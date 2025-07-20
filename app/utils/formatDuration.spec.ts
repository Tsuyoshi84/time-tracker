import { describe, expect, it } from 'vitest'
import { formatDuration } from './formatDuration'

describe('formatDuration', () => {
	it('should return "0:00:00" for zero or negative milliseconds', () => {
		expect(formatDuration(0)).toBe('0:00:00')
		expect(formatDuration(-1000)).toBe('0:00:00')
	})

	it('should format seconds correctly', () => {
		expect(formatDuration(1000)).toBe('0:00:01')
		expect(formatDuration(30000)).toBe('0:00:30')
		expect(formatDuration(59000)).toBe('0:00:59')
	})

	it('should format minutes correctly', () => {
		expect(formatDuration(60000)).toBe('0:01:00')
		expect(formatDuration(90000)).toBe('0:01:30')
		expect(formatDuration(3540000)).toBe('0:59:00')
	})

	it('should format hours correctly', () => {
		expect(formatDuration(3600000)).toBe('1:00:00')
		expect(formatDuration(7323000)).toBe('2:02:03')
		expect(formatDuration(3661000)).toBe('1:01:01')
	})

	it('should handle large durations', () => {
		expect(formatDuration(86400000)).toBe('24:00:00') // 24 hours
		expect(formatDuration(90061000)).toBe('25:01:01') // 25 hours, 1 minute, 1 second
	})
})
