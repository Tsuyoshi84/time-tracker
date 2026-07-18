import type { Milliseconds } from '../types/index.ts'

/**
 * Converts a numeric value to the branded Milliseconds type.
 * @param value - Duration in milliseconds
 * @returns Branded milliseconds value
 */
export function toMilliseconds(value: number): Milliseconds {
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- central branded type constructor
	return value as Milliseconds
}

/** Zero milliseconds as a branded constant. */
export const ZERO_MILLISECONDS = toMilliseconds(0)
