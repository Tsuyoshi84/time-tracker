import type { DateString, DayStats, MonthStats, TimeSession } from '../types/index.ts'
import { getAllSessions } from '../utils/database.ts'
import {
	buildDailyStatsForMonth,
	buildVisibleMonthStats,
} from '../utils/buildMonthStats.ts'

interface UseMonthlyStatsReturnType {
	/** Monthly statistics for months with at least two sessions. */
	monthlyStats: Readonly<Ref<MonthStats[]>>
	/** Daily statistics for the currently selected month. */
	dailyStatsForSelectedMonth: Readonly<Ref<DayStats[]>>
	/** Start date of the currently selected month. */
	selectedMonthStartDate: Ref<DateString | undefined>
	/** Whether monthly data is loading. */
	loading: Readonly<Ref<boolean>>
	/** Error message from the last failed operation. */
	errorMessage: Readonly<Ref<string>>
	/**
	 * Load statistics for all months with sufficient session history.
	 * @returns Promise that resolves when stats are loaded
	 */
	loadMonthlyStats(): Promise<void>
}

/**
 * Composable for managing monthly statistics and daily breakdowns.
 *
 * Provides functionality for:
 * - Calculating monthly statistics across all history
 * - Filtering months with at least two sessions
 * - Building daily stats for the selected month
 *
 * @returns UseMonthlyStatsReturnType - API for monthly statistics management
 */
export function useMonthlyStats(): UseMonthlyStatsReturnType {
	const allSessions = shallowRef<TimeSession[]>([])
	const monthlyStats = shallowRef<MonthStats[]>([])
	const selectedMonthStartDate = shallowRef<DateString | undefined>(undefined)
	const loading = shallowRef<boolean>(true)
	const errorMessage = shallowRef<string>('')

	const dailyStatsForSelectedMonth = computed<DayStats[]>(() => {
		const selectedMonth = monthlyStats.value.find(
			(month) => month.startDate === selectedMonthStartDate.value,
		)

		if (selectedMonth === undefined) {
			return []
		}

		return buildDailyStatsForMonth(allSessions.value, selectedMonth.startDate, selectedMonth.endDate)
	})

	// fallow-ignore-next-line complexity
	async function loadMonthlyStats(): Promise<void> {
		loading.value = true
		errorMessage.value = ''

		try {
			allSessions.value = await getAllSessions()
			const stats = buildVisibleMonthStats(allSessions.value)

			monthlyStats.value = stats

			const hasCurrentSelection = stats.some(
				(month) => month.startDate === selectedMonthStartDate.value,
			)

			if (!hasCurrentSelection) {
				selectedMonthStartDate.value = stats[0]?.startDate
			}
		} catch (error) {
			errorMessage.value = `Failed to load monthly stats: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		} finally {
			loading.value = false
		}
	}

	return {
		monthlyStats: shallowReadonly(monthlyStats),
		dailyStatsForSelectedMonth: shallowReadonly(dailyStatsForSelectedMonth),
		selectedMonthStartDate,
		loading: shallowReadonly(loading),
		errorMessage: shallowReadonly(errorMessage),
		loadMonthlyStats,
	}
}
