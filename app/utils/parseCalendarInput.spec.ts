import { CalendarDate, Time } from '@internationalized/date'
import { describe, expect, it } from 'vitest'

import { parseCalendarInput, parseTimeInputValue } from './parseCalendarInput'

describe('parseCalendarInput', () => {
	it('should parse a calendar date value', () => {
		const value = new CalendarDate(2023, 6, 15)

		expect(parseCalendarInput(value)?.toString()).toBe('2023-06-15')
	})

	it('should return null for invalid values', () => {
		expect(parseCalendarInput(null)).toBeNull()
		expect(parseCalendarInput('2023-06-15')).toBeNull()
	})
})

describe('parseTimeInputValue', () => {
	it('should parse a time value', () => {
		const value = new Time(14, 30, 0)

		expect(parseTimeInputValue(value)?.toString()).toBe('14:30:00')
	})

	it('should return null for invalid values', () => {
		expect(parseTimeInputValue(undefined)).toBeNull()
		expect(parseTimeInputValue({ hour: 1 })).toBeNull()
	})
})
