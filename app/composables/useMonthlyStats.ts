import { type Ref, shallowReadonly, shallowRef } from 'vue'
import type { Milliseconds, MonthStats } from '../types/index.ts'
import { convertToDateString } from '../utils/convertToDateString.ts'
import { getSessionsInDateRange } from '../utils/database.ts'

interface UseMonthlyStatsReturnType {
	/** Monthly statistics for the last 6 months. */
	monthlyStats: Readonly<Ref<MonthStats[]>>
	/** Error message from the last failed operation. */
	errorMessage: Readonly<Ref<string>>
	/**
	 * Load statistics for the last 6 months.
	 * Calculates monthly totals and session counts.
	 * @returns Promise that resolves when stats are loaded
	 */
	loadMonthlyStats(): Promise<void>
}

/**
 * Composable for managing monthly statistics.
 *
 * Provides functionality for:
 * - Calculating monthly statistics for the last 6 months
 * - Tracking total duration and session counts per month
 *
 * @returns UseMonthlyStatsReturnType - API for monthly statistics management
 */
export function useMonthlyStats(): UseMonthlyStatsReturnType {
	const monthlyStats = shallowRef<MonthStats[]>([])
	const errorMessage = shallowRef<string>('')

	async function loadMonthlyStats(): Promise<void> {
		try {
			const stats: MonthStats[] = []
			const now = new Date()

			// Get the last 6 months (including current month)
			for (let i = 0; i < 6; i++) {
				const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
				const startDate = getStartOfMonth(monthDate)
				const endDate = getEndOfMonth(monthDate)

				const startDateStr = convertToDateString(startDate)
				const endDateStr = convertToDateString(endDate)

				const monthSessions = await getSessionsInDateRange(startDateStr, endDateStr)

				const completedSessions = monthSessions.filter((s) => s.endTime)
				const totalDuration = completedSessions.reduce<Milliseconds>((total, session) => {
					if (session.endTime) {
						return (total +
							(session.endTime.getTime() - session.startTime.getTime())) as Milliseconds
					}
					return total
				}, 0 as Milliseconds)

				const monthLabel = monthDate.toLocaleDateString('en-US', {
					month: 'long',
					year: 'numeric',
				})

				stats.push({
					monthLabel,
					startDate: startDateStr,
					endDate: endDateStr,
					totalDuration,
					sessionCount: monthSessions.length,
				})
			}

			monthlyStats.value = stats
		} catch (err) {
			errorMessage.value = `Failed to load monthly stats: ${
				err instanceof Error ? err.message : 'Unknown error'
			}`
		}
	}

	return {
		monthlyStats: shallowReadonly(monthlyStats),
		errorMessage: shallowReadonly(errorMessage),
		loadMonthlyStats,
	}
}

// Helper functions
function getStartOfMonth(date: Date): Date {
	const result = new Date(date.getFullYear(), date.getMonth(), 1)
	result.setHours(0, 0, 0, 0)
	return result
}

function getEndOfMonth(date: Date): Date {
	const result = new Date(date.getFullYear(), date.getMonth() + 1, 0)
	result.setHours(23, 59, 59, 999)
	return result
}
