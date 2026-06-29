import { CalendarDate, Time } from '@internationalized/date'
import { describe, expect, it } from 'vitest'

import { combineDateAndTime } from './combineDateAndTime'

describe('combineDateAndTime', () => {
	it('should combine date and time into a local Date', () => {
		const date = new CalendarDate(2023, 6, 15)
		const time = new Time(14, 30)

		const result = combineDateAndTime(date, time)

		expect(result.getFullYear()).toBe(2023)
		expect(result.getMonth()).toBe(5)
		expect(result.getDate()).toBe(15)
		expect(result.getHours()).toBe(14)
		expect(result.getMinutes()).toBe(30)
	})

	it('should handle midnight', () => {
		const date = new CalendarDate(2023, 1, 1)
		const time = new Time(0, 0)

		const result = combineDateAndTime(date, time)

		expect(result.getHours()).toBe(0)
		expect(result.getMinutes()).toBe(0)
	})
})
