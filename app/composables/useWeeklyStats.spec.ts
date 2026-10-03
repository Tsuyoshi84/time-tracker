import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useWeeklyStats } from './useWeeklyStats.ts'

const { getSessionsInDateRange } = vi.hoisted(() => ({
	getSessionsInDateRange: vi.fn<(startDate: string, endDate: string) => Promise<never[]>>(),
}))

vi.mock('../database/database.ts', () => ({ getSessionsInDateRange }))

describe('useWeeklyStats', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	it('keeps the selected weekday aligned when navigating weeks', async () => {
		getSessionsInDateRange.mockResolvedValue([])
		const weeklyStats = useWeeklyStats()
		const initialDate = weeklyStats.selectedDate.value

		await weeklyStats.navigateWeek.next()

		expect(weeklyStats.selectedDate.value).not.toBe(initialDate)
		expect(weeklyStats.dailyStats.value.map((day) => day.date)).toContain(
			weeklyStats.selectedDate.value,
		)
	})

	it('tracks loading until the weekly sessions finish loading', async () => {
		let finishLoading: (sessions: never[]) => void = () => {}
		getSessionsInDateRange.mockImplementation(
			() =>
				new Promise((resolve) => {
					finishLoading = resolve
				}),
		)
		const weeklyStats = useWeeklyStats()

		const loading = weeklyStats.loadWeeklyStats()
		expect(weeklyStats.loading.value).toBe(true)

		finishLoading([])
		await loading

		expect(weeklyStats.loading.value).toBe(false)
	})
})
