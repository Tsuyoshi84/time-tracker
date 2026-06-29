import { describe, expect, it } from 'vitest'

import { formatSessionTimeRange } from './formatSessionTimeRange'

describe('formatSessionTimeRange', () => {
	it('should show times only for same-day sessions', () => {
		const start = new Date('2023-06-15T09:30:00')
		const end = new Date('2023-06-15T11:45:00')

		expect(formatSessionTimeRange(start, end)).toBe('09:30 – 11:45')
	})

	it('should include dates for cross-day sessions', () => {
		const start = new Date('2023-06-15T23:00:00')
		const end = new Date('2023-06-16T01:00:00')

		expect(formatSessionTimeRange(start, end)).toBe('Jun 15, 23:00 – Jun 16, 01:00')
	})
})
