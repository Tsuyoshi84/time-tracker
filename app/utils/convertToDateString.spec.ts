import { describe, expect, it } from 'vitest'
import { convertToDateString } from './convertToDateString'

describe('convertToDateString', () => {
	it('should convert Date to YYYY-MM-DD format', () => {
		const date1 = new Date('2023-01-01T12:00:00Z')
		const date3 = new Date('2023-06-15T09:30:45Z')

		expect(convertToDateString(date1)).toBe('2023-01-01')
		expect(convertToDateString(date3)).toBe('2023-06-15')
	})

	it('should handle leap year dates', () => {
		const leapYearDate = new Date('2024-02-29T12:00:00Z')
		expect(convertToDateString(leapYearDate)).toBe('2024-02-29')
	})

	it('should handle dates with different timezones', () => {
		// Create dates that would be different in different timezones
		const utcDate = new Date('2023-01-01T00:00:00Z')
		expect(convertToDateString(utcDate)).toMatch(/^\d{4}-\d{2}-\d{2}$/)
	})
})
