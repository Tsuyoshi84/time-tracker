import { Temporal } from '@js-temporal/polyfill'
import { describe, expect, it } from 'vitest'
import { parseTimeInput } from './parseTimeInput'

describe('parseTimeInput', () => {
	it('should parse valid time strings', () => {
		const time1 = parseTimeInput('09:30')
		const time2 = parseTimeInput('14:45')
		const time3 = parseTimeInput('23:59')
		const time4 = parseTimeInput('9:30') // Single digit hour is valid

		expect(time1).toBeInstanceOf(Temporal.PlainDateTime)
		expect(time2).toBeInstanceOf(Temporal.PlainDateTime)
		expect(time3).toBeInstanceOf(Temporal.PlainDateTime)
		expect(time4).toBeInstanceOf(Temporal.PlainDateTime)

		if (time1 && time2 && time3 && time4) {
			expect(time1.hour).toBe(9)
			expect(time1.minute).toBe(30)
			expect(time2.hour).toBe(14)
			expect(time2.minute).toBe(45)
			expect(time3.hour).toBe(23)
			expect(time3.minute).toBe(59)
			expect(time4.hour).toBe(9)
			expect(time4.minute).toBe(30)
		}
	})

	it('should handle midnight and noon', () => {
		const midnight = parseTimeInput('00:00')
		const noon = parseTimeInput('12:00')

		expect(midnight).toBeInstanceOf(Temporal.PlainDateTime)
		expect(noon).toBeInstanceOf(Temporal.PlainDateTime)

		if (midnight && noon) {
			expect(midnight.hour).toBe(0)
			expect(midnight.minute).toBe(0)
			expect(noon.hour).toBe(12)
			expect(noon.minute).toBe(0)
		}
	})

	it('should return null for invalid formats', () => {
		expect(parseTimeInput('09:5')).toBeNull() // Missing leading zero in minutes
		expect(parseTimeInput('9:5')).toBeNull() // Missing leading zero in minutes
		expect(parseTimeInput('09:30:00')).toBeNull() // Includes seconds
		expect(parseTimeInput('09.30')).toBeNull() // Wrong separator
		expect(parseTimeInput('')).toBeNull() // Empty string
		expect(parseTimeInput('abc')).toBeNull() // Non-numeric
	})

	it('should return null for out of range values', () => {
		expect(parseTimeInput('24:00')).toBeNull() // Hour > 23
		expect(parseTimeInput('25:30')).toBeNull() // Hour > 23
		expect(parseTimeInput('09:60')).toBeNull() // Minute > 59
		expect(parseTimeInput('09:99')).toBeNull() // Minute > 59
		expect(parseTimeInput('-1:30')).toBeNull() // Negative hour
		expect(parseTimeInput('09:-1')).toBeNull() // Negative minute
	})

	it('should set the date to today', () => {
		const today = Temporal.Now.plainDateISO()
		const parsedTime = parseTimeInput('14:30')

		expect(parsedTime).toBeInstanceOf(Temporal.PlainDateTime)
		if (parsedTime) {
			expect(parsedTime.year).toBe(today.year)
			expect(parsedTime.month).toBe(today.month)
			expect(parsedTime.day).toBe(today.day)
		}
	})
})
