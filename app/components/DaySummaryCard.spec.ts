import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DaySummaryCard from './DaySummaryCard.vue'
import type { WeekDay } from '~/types/index.ts'

describe('DaySummaryCard', () => {
	const mockWeekDay: WeekDay = {
		date: '2024-01-15' as const,
		dayName: 'Mon',
		isToday: false,
		totalDuration: 3600, // 1 hour in seconds
		sessionCount: 2,
	}

	it('should render correctly with basic props', () => {
		const wrapper = mount(DaySummaryCard, {
			props: {
				weekDay: mockWeekDay,
				selected: false,
				disabled: false,
			},
		})

		expect(wrapper.exists()).toBe(true)
	})
})