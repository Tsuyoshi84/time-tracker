import { describe, expect, it } from 'vitest'
import { parseTimeInput } from './parseTimeInput'

describe('parseTimeInput', () => {
	it('should parse valid time strings', () => {
		const time1 = parseTimeInput('09:30')
		const time2 = parseTimeInput('14:45')
		const time3 = parseTimeInput('23:59')
		const time4 = parseTimeInput('9:30') // Single digit hour is valid

		expect(time1).toBeInstanceOf(Date)
		expect(time2).toBeInstanceOf(Date)
		expect(time3).toBeInstanceOf(Date)
		expect(time4).toBeInstanceOf(Date)

		if (time1 && time2 && time3 && time4) {
			expect(time1.getHours()).toBe(9)
			expect(time1.getMinutes()).toBe(30)
			expect(time2.getHours()).toBe(14)
			expect(time2.getMinutes()).toBe(45)
			expect(time3.getHours()).toBe(23)
			expect(time3.getMinutes()).toBe(59)
			expect(time4.getHours()).toBe(9)
			expect(time4.getMinutes()).toBe(30)
		}
	})

	it('should handle midnight and noon', () => {
		const midnight = parseTimeInput('00:00')
		const noon = parseTimeInput('12:00')

		expect(midnight).toBeInstanceOf(Date)
		expect(noon).toBeInstanceOf(Date)

		if (midnight && noon) {
			expect(midnight.getHours()).toBe(0)
			expect(midnight.getMinutes()).toBe(0)
			expect(noon.getHours()).toBe(12)
			expect(noon.getMinutes()).toBe(0)
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
		const today = new Date()
		const parsedTime = parseTimeInput('14:30')

		expect(parsedTime).toBeInstanceOf(Date)
		if (parsedTime) {
			expect(parsedTime.getFullYear()).toBe(today.getFullYear())
			expect(parsedTime.getMonth()).toBe(today.getMonth())
			expect(parsedTime.getDate()).toBe(today.getDate())
		}
	})
})
