import { describe, expect, it } from 'vitest'
import { calculateDuration } from './calculateDuration.ts'

describe('calculateDuration', () => {
	it('should calculate duration correctly', () => {
		const startTime = new Date('2023-01-01T10:00:00')
		const endTime = new Date('2023-01-01T11:30:00')

		const duration = calculateDuration(startTime, endTime)
		expect(duration).toBe(90 * 60 * 1000) // 90 minutes in milliseconds
	})

	it('should return 0 when start time equals end time', () => {
		const time = new Date('2023-01-01T10:00:00')
		const duration = calculateDuration(time, time)
		expect(duration).toBe(0)
	})

	it('should return 0 when start time is after end time', () => {
		const startTime = new Date('2023-01-01T11:00:00')
		const endTime = new Date('2023-01-01T10:00:00')

		const duration = calculateDuration(startTime, endTime)
		expect(duration).toBe(0)
	})

	it('should handle different days', () => {
		const startTime = new Date('2023-01-01T23:00:00')
		const endTime = new Date('2023-01-02T01:00:00')

		const duration = calculateDuration(startTime, endTime)
		expect(duration).toBe(2 * 60 * 60 * 1000) // 2 hours in milliseconds
	})

	it('should handle milliseconds precision', () => {
		const startTime = new Date('2023-01-01T10:00:00.500')
		const endTime = new Date('2023-01-01T10:00:01.200')

		const duration = calculateDuration(startTime, endTime)
		expect(duration).toBe(700) // 700 milliseconds
	})

	it('should handle very short durations', () => {
		const startTime = new Date('2023-01-01T10:00:00')
		const endTime = new Date('2023-01-01T10:00:00.001')

		const duration = calculateDuration(startTime, endTime)
		expect(duration).toBe(1) // 1 millisecond
	})
})
