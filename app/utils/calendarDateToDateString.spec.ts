import { CalendarDate } from '@internationalized/date'
import { describe, expect, it } from 'vitest'
import { calendarDateToDateString } from './calendarDateToDateString.ts'

describe('calendarDateToDateString', () => {
	it.each([
		{ year: 2023, month: 1, day: 15, expected: '2023-01-15' },
		{ year: 2023, month: 3, day: 5, expected: '2023-03-05' },
		{ year: 2023, month: 12, day: 25, expected: '2023-12-25' },
		{ year: 2024, month: 2, day: 29, expected: '2024-02-29' },
		{ year: 2000, month: 1, day: 1, expected: '2000-01-01' },
		{ year: 2030, month: 6, day: 15, expected: '2030-06-15' },
		{ year: 1999, month: 12, day: 31, expected: '1999-12-31' },
		{ year: 2023, month: 1, day: 1, expected: '2023-01-01' },
		{ year: 2023, month: 12, day: 31, expected: '2023-12-31' },
		{ year: 2023, month: 6, day: 15, expected: '2023-06-15' },
		{ year: 2023, month: 9, day: 15, expected: '2023-09-15' },
		{ year: 2023, month: 12, day: 15, expected: '2023-12-15' },
		{ year: 2023, month: 1, day: 9, expected: '2023-01-09' },
		{ year: 2023, month: 6, day: 28, expected: '2023-06-28' },
		{ year: 2023, month: 6, day: 30, expected: '2023-06-30' },
	])('should convert a CalendarDate to DateString format', ({ year, month, day, expected }) => {
		const date = new CalendarDate(year, month, day)
		const result = calendarDateToDateString(date)
		expect(result).toBe(expected)
	})
})
