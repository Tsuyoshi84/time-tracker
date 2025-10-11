import { describe, expect, it } from 'vitest'
import { sum } from './sum.ts'

describe('sum', () => {
	it.each([
		[[1, 2, 3], 6],
		[[-1, 1, 2], 2],
		[[0, 0, 0], 0],
		[[1], 1],
		[[], 0],
	])('should return the sum of an array of numbers', (numbers, expected) => {
		expect(sum(numbers)).toBe(expected)
	})
})
