import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { WeekDay } from '~/types/index.ts'
import DaySummaryCard from './DaySummaryCard.vue'

describe('DaySummaryCard', () => {
	const baseWeekDay: WeekDay = {
		date: '2024-01-15' as const,
		dayName: 'Mon',
		isToday: false,
		totalDuration: 3600000, // 1 hour in milliseconds (to match actual usage)
		sessionCount: 2,
	}

	it('should render correctly with basic props', () => {
		const wrapper = mount(DaySummaryCard, {
			props: {
				weekDay: baseWeekDay,
				selected: false,
				disabled: false,
			},
		})

		expect(wrapper.exists()).toBe(true)
	})

	it('should display formatted date and day name', () => {
		const wrapper = mount(DaySummaryCard, {
			props: {
				weekDay: baseWeekDay,
				selected: false,
				disabled: false,
			},
		})

		const dateText = wrapper.find('.text-gray-500.text-xs').text()
		expect(dateText).toContain('Jan 15') // formatted date
		expect(dateText).toContain('(Mon)') // day name
	})

	it('should display formatted duration correctly', () => {
		const wrapper = mount(DaySummaryCard, {
			props: {
				weekDay: { ...baseWeekDay, totalDuration: 3661000 }, // 1 hour, 1 minute, 1 second in milliseconds
				selected: false,
				disabled: false,
			},
		})

		const durationText = wrapper.find('.text-2xl.font-semibold').text()
		expect(durationText).toBe('1:01:01')
	})

	it('should display session count correctly with singular form', () => {
		const wrapper = mount(DaySummaryCard, {
			props: {
				weekDay: { ...baseWeekDay, sessionCount: 1 },
				selected: false,
				disabled: false,
			},
		})

		const sessionText = wrapper.find('.text-xs.text-gray-500.mt-1').text()
		expect(sessionText).toBe('1 session')
	})

	it('should display session count correctly with plural form', () => {
		const wrapper = mount(DaySummaryCard, {
			props: {
				weekDay: { ...baseWeekDay, sessionCount: 3 },
				selected: false,
				disabled: false,
			},
		})

		const sessionText = wrapper.find('.text-xs.text-gray-500.mt-1').text()
		expect(sessionText).toBe('3 sessions')
	})

	it('should apply selected styling when selected prop is true', () => {
		const wrapper = mount(DaySummaryCard, {
			props: {
				weekDay: baseWeekDay,
				selected: true,
				disabled: false,
			},
		})

		const appCard = wrapper.find('[role="button"]')
		expect(appCard.classes()).toContain('border-2')
		expect(appCard.classes()).toContain('border-gray-400')
	})

	it('should apply today styling when isToday is true', () => {
		const wrapper = mount(DaySummaryCard, {
			props: {
				weekDay: { ...baseWeekDay, isToday: true },
				selected: false,
				disabled: false,
			},
		})

		const appCard = wrapper.find('[role="button"]')
		expect(appCard.classes()).toContain('border-secondary')
		expect(appCard.classes()).toContain('bg-secondary/10')
	})

	it('should apply primary color to duration when totalDuration > 0', () => {
		const wrapper = mount(DaySummaryCard, {
			props: {
				weekDay: { ...baseWeekDay, totalDuration: 3600000 }, // 1 hour in milliseconds
				selected: false,
				disabled: false,
			},
		})

		const durationElement = wrapper.find('.text-2xl.font-semibold')
		expect(durationElement.classes()).toContain('text-primary')
	})

	it('should apply gray color to duration when totalDuration is 0', () => {
		const wrapper = mount(DaySummaryCard, {
			props: {
				weekDay: { ...baseWeekDay, totalDuration: 0 },
				selected: false,
				disabled: false,
			},
		})

		const durationElement = wrapper.find('.text-2xl.font-semibold')
		expect(durationElement.classes()).toContain('text-gray-400')
	})

	it('should apply secondary color to session count when sessionCount > 0', () => {
		const wrapper = mount(DaySummaryCard, {
			props: {
				weekDay: { ...baseWeekDay, sessionCount: 2 },
				selected: false,
				disabled: false,
			},
		})

		const sessionElement = wrapper.find('.text-xs.text-gray-500.mt-1')
		expect(sessionElement.classes()).toContain('text-secondary')
	})

	it('should apply gray color to session count when sessionCount is 0', () => {
		const wrapper = mount(DaySummaryCard, {
			props: {
				weekDay: { ...baseWeekDay, sessionCount: 0 },
				selected: false,
				disabled: false,
			},
		})

		const sessionElement = wrapper.find('.text-xs.text-gray-500.mt-1')
		expect(sessionElement.classes()).toContain('text-gray-400')
	})

	it('should emit selectDay event when clicked and not disabled', async () => {
		const wrapper = mount(DaySummaryCard, {
			props: {
				weekDay: baseWeekDay,
				selected: false,
				disabled: false,
			},
		})

		await wrapper.find('[role="button"]').trigger('click')

		expect(wrapper.emitted()).toHaveProperty('selectDay')
		expect(wrapper.emitted('selectDay')).toEqual([['2024-01-15']])
	})

	it('should not emit selectDay event when clicked and disabled', async () => {
		const wrapper = mount(DaySummaryCard, {
			props: {
				weekDay: baseWeekDay,
				selected: false,
				disabled: true,
			},
		})

		await wrapper.find('[role="button"]').trigger('click')

		expect(wrapper.emitted()).not.toHaveProperty('selectDay')
	})

	it('should have correct accessibility attributes when selected', () => {
		const wrapper = mount(DaySummaryCard, {
			props: {
				weekDay: baseWeekDay,
				selected: true,
				disabled: false,
			},
		})

		const button = wrapper.find('[role="button"]')
		expect(button.attributes('aria-pressed')).toBe('true')
		expect(button.attributes('aria-disabled')).toBe('false')
		expect(button.attributes('tabindex')).toBe('0')
	})

	it('should have correct accessibility attributes when not selected', () => {
		const wrapper = mount(DaySummaryCard, {
			props: {
				weekDay: baseWeekDay,
				selected: false,
				disabled: false,
			},
		})

		const button = wrapper.find('[role="button"]')
		expect(button.attributes('aria-pressed')).toBe('false')
		expect(button.attributes('aria-disabled')).toBe('false')
		expect(button.attributes('tabindex')).toBe('0')
	})

	it('should have correct accessibility attributes when disabled', () => {
		const wrapper = mount(DaySummaryCard, {
			props: {
				weekDay: baseWeekDay,
				selected: false,
				disabled: true,
			},
		})

		const button = wrapper.find('[role="button"]')
		expect(button.attributes('aria-disabled')).toBe('true')
		expect(button.attributes('tabindex')).toBe('-1')
	})

	it('should display zero duration correctly', () => {
		const wrapper = mount(DaySummaryCard, {
			props: {
				weekDay: { ...baseWeekDay, totalDuration: 0 },
				selected: false,
				disabled: false,
			},
		})

		const durationText = wrapper.find('.text-2xl.font-semibold').text()
		expect(durationText).toBe('0:00:00')
	})

	it('should handle zero sessions correctly', () => {
		const wrapper = mount(DaySummaryCard, {
			props: {
				weekDay: { ...baseWeekDay, sessionCount: 0 },
				selected: false,
				disabled: false,
			},
		})

		const sessionText = wrapper.find('.text-xs.text-gray-500.mt-1').text()
		expect(sessionText).toBe('0 sessions')
	})
})
