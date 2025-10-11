import { CalendarDate } from '@internationalized/date'
import { describe, expect, it } from 'vitest'
import type { DateString } from '~/types/index.ts'
import { dateStringToCalendarDate } from './dateStringToCalendarDate.ts'

describe('dateStringToCalendarDate', () => {
	it.each([
		{ dateString: '2023-01-15' as DateString, expected: { year: 2023, month: 1, day: 15 } },
		{ dateString: '2023-03-05' as DateString, expected: { year: 2023, month: 3, day: 5 } },
		{ dateString: '2023-12-25' as DateString, expected: { year: 2023, month: 12, day: 25 } },
		{ dateString: '2024-02-29' as DateString, expected: { year: 2024, month: 2, day: 29 } },
		{ dateString: '2000-01-01' as DateString, expected: { year: 2000, month: 1, day: 1 } },
		{ dateString: '2030-06-15' as DateString, expected: { year: 2030, month: 6, day: 15 } },
		{ dateString: '1999-12-31' as DateString, expected: { year: 1999, month: 12, day: 31 } },
		{ dateString: '2023-01-01' as DateString, expected: { year: 2023, month: 1, day: 1 } },
		{ dateString: '2023-12-31' as DateString, expected: { year: 2023, month: 12, day: 31 } },
		{ dateString: '2023-06-15' as DateString, expected: { year: 2023, month: 6, day: 15 } },
		{ dateString: '2023-09-15' as DateString, expected: { year: 2023, month: 9, day: 15 } },
		{ dateString: '2023-12-15' as DateString, expected: { year: 2023, month: 12, day: 15 } },
		{ dateString: '2023-01-09' as DateString, expected: { year: 2023, month: 1, day: 9 } },
		{ dateString: '2023-06-28' as DateString, expected: { year: 2023, month: 6, day: 28 } },
		{ dateString: '2023-06-30' as DateString, expected: { year: 2023, month: 6, day: 30 } },
		{ dateString: '2023-02-28' as DateString, expected: { year: 2023, month: 2, day: 28 } },
		{ dateString: '2023-04-30' as DateString, expected: { year: 2023, month: 4, day: 30 } },
		{ dateString: '2023-05-31' as DateString, expected: { year: 2023, month: 5, day: 31 } },
		{ dateString: '2023-07-31' as DateString, expected: { year: 2023, month: 7, day: 31 } },
		{ dateString: '2023-08-31' as DateString, expected: { year: 2023, month: 8, day: 31 } },
		{ dateString: '2023-10-31' as DateString, expected: { year: 2023, month: 10, day: 31 } },
		{ dateString: '2023-11-30' as DateString, expected: { year: 2023, month: 11, day: 30 } },
	])('should convert a DateString to CalendarDate', ({ dateString, expected }) => {
		const result = dateStringToCalendarDate(dateString)
		expect(result).toBeInstanceOf(CalendarDate)
		expect(result.year).toBe(expected.year)
		expect(result.month).toBe(expected.month)
		expect(result.day).toBe(expected.day)
	})

	it('should throw error for invalid date string format', () => {
		// This test is for the error handling, but since DateString is a branded type,
		// TypeScript should prevent invalid formats at compile time.
		// However, we can test the runtime validation logic
		expect(() => {
			dateStringToCalendarDate('invalid-date' as DateString)
		}).toThrow('Invalid date string format')
	})
})
