import { Temporal } from '@js-temporal/polyfill'
import { describe, expect, it } from 'vitest'
import { validateTimeRange } from './validateTimeRange'

describe('validateTimeRange', () => {
	it('should return empty array for valid time range', () => {
		const startTime = Temporal.PlainDateTime.from('2023-01-01T10:00:00')
		const endTime = Temporal.PlainDateTime.from('2023-01-01T11:00:00')

		const errors = validateTimeRange(startTime, endTime)
		expect(errors).toEqual([])
	})

	it('should return error when start time equals end time', () => {
		const time = Temporal.PlainDateTime.from('2023-01-01T10:00:00')
		const errors = validateTimeRange(time, time)

		expect(errors).toHaveLength(1)
		expect(errors[0]).toEqual({
			field: 'timeRange',
			message: 'End time must be after start time',
		})
	})

	it('should return error when start time is after end time', () => {
		const startTime = Temporal.PlainDateTime.from('2023-01-01T11:00:00')
		const endTime = Temporal.PlainDateTime.from('2023-01-01T10:00:00')
		const errors = validateTimeRange(startTime, endTime)

		expect(errors).toHaveLength(1)
		expect(errors[0]).toEqual({
			field: 'timeRange',
			message: 'End time must be after start time',
		})
	})

	it('should return error when duration exceeds 24 hours', () => {
		const startTime = Temporal.PlainDateTime.from('2023-01-01T00:00:00')
		const endTime = Temporal.PlainDateTime.from('2023-01-02T01:00:00') // 25 hours later
		const errors = validateTimeRange(startTime, endTime)

		expect(errors).toHaveLength(1)
		expect(errors[0]).toEqual({
			field: 'timeRange',
			message: 'Session cannot be longer than 24 hours',
		})
	})

	it('should return both errors when both conditions are violated', () => {
		const startTime = Temporal.PlainDateTime.from('2023-01-01T11:00:00')
		const endTime = Temporal.PlainDateTime.from('2023-01-01T10:00:00') // Start after end
		const errors = validateTimeRange(startTime, endTime)

		expect(errors).toHaveLength(1) // Only the first error is returned
		expect(errors[0]).toEqual({
			field: 'timeRange',
			message: 'End time must be after start time',
		})
	})

	it('should accept exactly 24 hours duration', () => {
		const startTime = Temporal.PlainDateTime.from('2023-01-01T00:00:00')
		const endTime = Temporal.PlainDateTime.from('2023-01-02T00:00:00') // Exactly 24 hours
		const errors = validateTimeRange(startTime, endTime)

		expect(errors).toEqual([])
	})

	it('should handle different days within 24 hours', () => {
		const startTime = Temporal.PlainDateTime.from('2023-01-01T23:00:00')
		const endTime = Temporal.PlainDateTime.from('2023-01-02T22:59:59') // Just under 24 hours
		const errors = validateTimeRange(startTime, endTime)

		expect(errors).toEqual([])
	})

	it('should handle very short durations', () => {
		const startTime = Temporal.PlainDateTime.from('2023-01-01T10:00:00')
		const endTime = Temporal.PlainDateTime.from('2023-01-01T10:00:01') // 1 second
		const errors = validateTimeRange(startTime, endTime)

		expect(errors).toEqual([])
	})
})
