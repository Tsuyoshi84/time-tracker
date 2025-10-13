import { type Ref, shallowReadonly, shallowRef } from 'vue'
import type { DayStats, Milliseconds, TimeSession } from '../types/index.ts'
import { convertToDateString } from '../utils/convertToDateString.ts'
import { getSessionsInDateRange } from '../utils/database.ts'

interface UseWeeklyStatsReturnType {
	/** Start date of the current week being viewed. */
	weekStart: Readonly<Ref<Date>>
	/** End date of the current week being viewed. */
	weekEnd: Readonly<Ref<Date>>
	/** Daily statistics for the current week. */
	dailyStats: Readonly<Ref<DayStats[]>>
	/** Error message from the last failed operation. */
	error: Readonly<Ref<string>>
	/**
	 * Load statistics for the current week.
	 * Calculates daily totals and session counts.
	 * @returns Promise that resolves when stats are loaded
	 */
	loadWeeklyStats(): Promise<void>
	/**
	 * Navigation methods for weekly view.
	 * Provides previous and next week navigation functionality.
	 */
	navigateWeek: {
		/**
		 * Navigate to the previous week.
		 * Updates weekStart, weekEnd, and loads new statistics.
		 *
		 * @async
		 * @returns Promise that resolves when navigation completes
		 */
		prev(): Promise<void>

		/**
		 * Navigate to the next week.
		 * Updates weekStart, weekEnd, and loads new statistics.
		 *
		 * @async
		 * @returns Promise that resolves when navigation completes
		 */
		next(): Promise<void>
	}
}

/**
 * Composable for managing weekly statistics.
 *
 * Provides functionality for:
 * - Calculating daily statistics for a week
 * - Navigating between weeks
 * - Tracking week start/end dates
 *
 * @returns UseWeeklyStatsReturnType - API for weekly statistics management
 */
export function useWeeklyStats(): UseWeeklyStatsReturnType {
	const weekStart = shallowRef<Date>(getStartOfWeek(new Date()))
	const weekEnd = shallowRef<Date>(getEndOfWeek(new Date()))
	const dailyStats = shallowRef<DayStats[]>([])
	const error = shallowRef<string>('')

	async function loadWeeklyStats(): Promise<void> {
		try {
			const weekStartStr = convertToDateString(weekStart.value)
			const weekEndStr = convertToDateString(weekEnd.value)

			const weekSessions = await getSessionsInDateRange(weekStartStr, weekEndStr)

			// Group sessions by date
			const sessionsByDate = new Map<string, TimeSession[]>()
			for (const session of weekSessions) {
				const date = session.date
				if (!sessionsByDate.has(date)) {
					sessionsByDate.set(date, [])
				}
				sessionsByDate.get(date)?.push(session)
			}

			// Calculate daily stats
			const stats: DayStats[] = []
			const currentDate = new Date(weekStart.value)

			for (let i = 0; i < 7; i++) {
				const dateStr = convertToDateString(currentDate)
				const daySessions = sessionsByDate.get(dateStr) || []

				const completedSessions = daySessions.filter((s) => s.endTime)
				const totalDuration = completedSessions.reduce<Milliseconds>((total, session) => {
					if (session.endTime) {
						return (total +
							(session.endTime.getTime() - session.startTime.getTime())) as Milliseconds
					}
					return total
				}, 0 as Milliseconds)

				stats.push({
					date: dateStr,
					totalDuration,
					sessionCount: daySessions.length,
					sessions: daySessions,
				})

				currentDate.setDate(currentDate.getDate() + 1)
			}

			dailyStats.value = stats
		} catch (err) {
			error.value = `Failed to load weekly stats: ${
				err instanceof Error ? err.message : 'Unknown error'
			}`
		}
	}

	async function navigateWeek(direction: 'prev' | 'next'): Promise<void> {
		const days = direction === 'prev' ? -7 : 7
		weekStart.value = new Date(weekStart.value.getTime() + days * 24 * 60 * 60 * 1000)
		weekEnd.value = new Date(weekEnd.value.getTime() + days * 24 * 60 * 60 * 1000)
		await loadWeeklyStats()
	}

	return {
		weekStart: shallowReadonly(weekStart),
		weekEnd: shallowReadonly(weekEnd),
		dailyStats: shallowReadonly(dailyStats),
		error: shallowReadonly(error),
		loadWeeklyStats,
		navigateWeek: {
			prev: () => navigateWeek('prev'),
			next: () => navigateWeek('next'),
		},
	}
}

// Helper functions
function getStartOfWeek(date: Date): Date {
	const result = new Date(date)
	const day = result.getDay()
	const diff = result.getDate() - day
	result.setDate(diff)
	result.setHours(0, 0, 0, 0)
	return result
}

function getEndOfWeek(date: Date): Date {
	const result = new Date(date)
	const day = result.getDay()
	const diff = result.getDate() - day + 6
	result.setDate(diff)
	result.setHours(23, 59, 59, 999)
	return result
}
