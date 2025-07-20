/**
 * Formats a duration in milliseconds to a human-readable string.
 * @param milliseconds - The duration in milliseconds
 * @returns A formatted string in HH:MM:SS format
 */
export function formatDuration(milliseconds: number): string {
	if (milliseconds <= 0) return '0:00:00'

	const totalSeconds = Math.floor(milliseconds / 1000)
	const hours = Math.floor(totalSeconds / 3600)
	const minutes = Math.floor((totalSeconds % 3600) / 60)
	const seconds = totalSeconds % 60

	function pad(num: number): string {
		return num < 10 ? `0${num}` : `${num}`
	}

	return `${hours}:${pad(minutes)}:${pad(seconds)}`
}
