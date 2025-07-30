import { Temporal } from '@js-temporal/polyfill'
import { describe, expect, it } from 'vitest'
import { convertToDateString } from './convertToDateString'

describe('convertToDateString', () => {
	it('should convert Temporal.PlainDate to YYYY-MM-DD format', () => {
		const date1 = Temporal.PlainDate.from('2023-01-01')
		const date3 = Temporal.PlainDate.from('2023-06-15')

		expect(convertToDateString(date1)).toBe('2023-01-01')
		expect(convertToDateString(date3)).toBe('2023-06-15')
	})

	it('should handle leap year dates', () => {
		const leapYearDate = Temporal.PlainDate.from('2024-02-29')
		expect(convertToDateString(leapYearDate)).toBe('2024-02-29')
	})

	it('should handle valid date strings', () => {
		const utcDate = Temporal.PlainDate.from('2023-01-01')
		expect(convertToDateString(utcDate)).toMatch(/^\d{4}-\d{2}-\d{2}$/)
	})
})
