import type { DateString, DayStats } from '../types/index.ts'
import { buildDailyStatsForWeek } from '../utils/buildDailyStatsForWeek.ts'
import { calendarDateToDateString } from '../utils/calendarDateToDateString.ts'
import { convertToDateString } from '../utils/convertToDateString.ts'
import { getSessionsInDateRange } from '../utils/database.ts'
import { dateStringToCalendarDate } from '../utils/dateStringToCalendarDate.ts'

interface UseWeeklyStatsReturnType {
	/** Currently selected date in the displayed week. */
	selectedDate: Ref<DateString>
	/** Start date of the current week being viewed. */
	weekStart: Readonly<Ref<Date>>
	/** End date of the current week being viewed. */
	weekEnd: Readonly<Ref<Date>>
	/** Daily statistics for the current week. */
	dailyStats: Readonly<Ref<DayStats[]>>
	/** Whether the weekly statistics are loading. */
	loading: Readonly<Ref<boolean>>
	/** Error message from the last failed operation. */
	errorMessage: Readonly<Ref<string>>
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
	const selectedDate = shallowRef<DateString>(convertToDateString(new Date()))
	const loading = shallowRef(false)
	const errorMessage = shallowRef<string>('')

	// fallow-ignore-next-line complexity
	async function loadWeeklyStats(): Promise<void> {
		loading.value = true
		try {
			const weekStartStr = convertToDateString(weekStart.value)
			const weekEndStr = convertToDateString(weekEnd.value)

			const weekSessions = await getSessionsInDateRange(weekStartStr, weekEndStr)
			dailyStats.value = buildDailyStatsForWeek(weekSessions, weekStartStr)
		} catch (error) {
			errorMessage.value = `Failed to load weekly stats: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		} finally {
			loading.value = false
		}
	}

	async function navigateWeek(direction: 'prev' | 'next'): Promise<void> {
		const days = direction === 'prev' ? -7 : 7
		weekStart.value = new Date(weekStart.value.getTime() + days * 24 * 60 * 60 * 1000)
		weekEnd.value = new Date(weekEnd.value.getTime() + days * 24 * 60 * 60 * 1000)
		selectedDate.value = calendarDateToDateString(
			dateStringToCalendarDate(selectedDate.value).add({ days }),
		)
		await loadWeeklyStats()
	}

	return {
		selectedDate,
		weekStart: shallowReadonly(weekStart),
		weekEnd: shallowReadonly(weekEnd),
		dailyStats: shallowReadonly(dailyStats),
		loading: shallowReadonly(loading),
		errorMessage: shallowReadonly(errorMessage),
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
