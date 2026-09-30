/** How much of a duration to include in the formatted string. */
export type DurationPrecision = 'minutes' | 'seconds'

interface FormatDurationOptions {
	/** Smallest unit to show. Defaults to seconds (`H:MM:SS`). */
	precision?: DurationPrecision
}

/**
 * Formats a duration in milliseconds to a human-readable string.
 * Seconds are truncated when precision is minutes.
 * @param milliseconds - The duration in milliseconds
 * @param options - Formatting options
 * @returns A formatted string in `H:MM:SS` or `H:MM` format
 */
export function formatDuration(milliseconds: number, options?: FormatDurationOptions): string {
	const precision = options?.precision ?? 'seconds'

	if (milliseconds <= 0) {
		return precision === 'minutes' ? '0:00' : '0:00:00'
	}

	const totalSeconds = Math.floor(milliseconds / 1000)
	const hours = Math.floor(totalSeconds / 3600)
	const minutes = Math.floor((totalSeconds % 3600) / 60)

	function pad(num: number): string {
		return num < 10 ? `0${num}` : `${num}`
	}

	if (precision === 'minutes') {
		return `${hours}:${pad(minutes)}`
	}

	const seconds = totalSeconds % 60
	return `${hours}:${pad(minutes)}:${pad(seconds)}`
}
