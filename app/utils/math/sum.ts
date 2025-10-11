/**
 * Calculates the sum of an array of numbers.
 * @param numbers - The array of numbers to sum
 * @returns The sum of the numbers
 * @example
 * ```typescript
 * sum([1, 2, 3]) // 6
 * ```
 */
export function sum<Number extends number>(numbers: Number[]): Number {
	return numbers.reduce((acc, curr) => (acc + curr) as Number, 0 as Number)
}
