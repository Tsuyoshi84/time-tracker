import { describe, expect, it } from 'vitest'
import { diffInMilliseconds } from './diffInMilliseconds.ts'

describe('diffInMilliseconds', () => {
	it('should calculate the difference between two dates in milliseconds', () => {
		const start = new Date('2023-01-01T10:00:00Z')
		const end = new Date('2023-01-01T11:30:00Z')
		const result = diffInMilliseconds(start, end)

		// 90 minutes = 90 * 60 * 1000 = 5,400,000 milliseconds
		expect(result).toBe(5_400_000)
	})

	it('should return 0 when start and end dates are the same', () => {
		const date = new Date('2023-01-01T10:00:00Z')
		const result = diffInMilliseconds(date, date)

		expect(result).toBe(0)
	})

	it('should return negative value when end is before start', () => {
		const start = new Date('2023-01-01T11:00:00Z')
		const end = new Date('2023-01-01T10:00:00Z')
		const result = diffInMilliseconds(start, end)

		// 1 hour = 60 * 60 * 1000 = 3,600,000 milliseconds
		expect(result).toBe(-3_600_000)
	})

	it('should handle dates with different timezones correctly', () => {
		const start = new Date('2023-01-01T10:00:00Z') // UTC
		const end = new Date('2023-01-01T12:00:00Z') // UTC (2 hours later)
		const result = diffInMilliseconds(start, end)

		// 2 hours = 2 * 60 * 60 * 1000 = 7,200,000 milliseconds
		expect(result).toBe(7_200_000)
	})

	it('should handle millisecond precision', () => {
		const start = new Date('2023-01-01T10:00:00.500Z')
		const end = new Date('2023-01-01T10:00:01.250Z')
		const result = diffInMilliseconds(start, end)

		// 750 milliseconds
		expect(result).toBe(750)
	})

	it('should handle large time differences', () => {
		const start = new Date('2023-01-01T00:00:00Z')
		const end = new Date('2023-01-02T00:00:00Z')
		const result = diffInMilliseconds(start, end)

		// 24 hours = 24 * 60 * 60 * 1000 = 86,400,000 milliseconds
		expect(result).toBe(86_400_000)
	})

	it('should handle leap year dates', () => {
		const start = new Date('2024-02-28T00:00:00Z') // 2024 is a leap year
		const end = new Date('2024-02-29T00:00:00Z')
		const result = diffInMilliseconds(start, end)

		// 24 hours = 24 * 60 * 60 * 1000 = 86,400,000 milliseconds
		expect(result).toBe(86_400_000)
	})

	it('should return the correct type (Milliseconds)', () => {
		const start = new Date('2023-01-01T10:00:00Z')
		const end = new Date('2023-01-01T10:00:01Z')
		const result = diffInMilliseconds(start, end)

		expect(typeof result).toBe('number')
		expect(result).toBe(1000)
	})
})
