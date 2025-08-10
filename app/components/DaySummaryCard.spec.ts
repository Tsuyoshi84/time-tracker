import userEvent from '@testing-library/user-event'
import { cleanup, render, screen } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import type { WeekDay } from '~/types/index.ts'
import DaySummaryCard from './DaySummaryCard.vue'

// Clean up after each test
afterEach(() => {
	cleanup()
})

describe('DaySummaryCard', () => {
	const baseWeekDay: WeekDay = {
		date: '2024-01-15' as const,
		dayName: 'Mon',
		isToday: false,
		totalDuration: 3600000, // 1 hour in milliseconds (to match actual usage)
		sessionCount: 2,
	}

	it('should render correctly with basic props', () => {
		render(DaySummaryCard, {
			props: {
				weekDay: baseWeekDay,
				selected: false,
				disabled: false,
			},
		})

		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	it('should display formatted date and day name', () => {
		const { container } = render(DaySummaryCard, {
			props: {
				weekDay: baseWeekDay,
				selected: false,
				disabled: false,
			},
		})

		// The text is in one element but split by spaces, so we use textContent
		const dateElement = container.querySelector('.text-gray-500.text-xs')
		expect(dateElement?.textContent?.trim()).toBe('Jan 15 (Mon)')
	})

	it('should display formatted duration correctly', () => {
		render(DaySummaryCard, {
			props: {
				weekDay: { ...baseWeekDay, totalDuration: 3661000 }, // 1 hour, 1 minute, 1 second in milliseconds
				selected: false,
				disabled: false,
			},
		})

		expect(screen.getByText('1:01:01')).toBeInTheDocument()
	})

	it('should display session count correctly with singular form', () => {
		render(DaySummaryCard, {
			props: {
				weekDay: { ...baseWeekDay, sessionCount: 1 },
				selected: false,
				disabled: false,
			},
		})

		expect(screen.getByText('1 session')).toBeInTheDocument()
	})

	it('should display session count correctly with plural form', () => {
		render(DaySummaryCard, {
			props: {
				weekDay: { ...baseWeekDay, sessionCount: 3 },
				selected: false,
				disabled: false,
			},
		})

		expect(screen.getByText('3 sessions')).toBeInTheDocument()
	})

	it('should apply selected styling when selected prop is true', () => {
		render(DaySummaryCard, {
			props: {
				weekDay: baseWeekDay,
				selected: true,
				disabled: false,
			},
		})

		const button = screen.getByRole('button')
		expect(button).toHaveClass('border-2')
		expect(button).toHaveClass('border-gray-400')
	})

	it('should apply today styling when isToday is true', () => {
		render(DaySummaryCard, {
			props: {
				weekDay: { ...baseWeekDay, isToday: true },
				selected: false,
				disabled: false,
			},
		})

		const button = screen.getByRole('button')
		expect(button).toHaveClass('border-secondary')
		expect(button).toHaveClass('bg-secondary/10')
	})

	it('should apply primary color to duration when totalDuration > 0', () => {
		const { container } = render(DaySummaryCard, {
			props: {
				weekDay: { ...baseWeekDay, totalDuration: 3600000 }, // 1 hour in milliseconds
				selected: false,
				disabled: false,
			},
		})

		const durationElement = container.querySelector('.text-2xl.font-semibold')
		expect(durationElement).toHaveClass('text-primary')
	})

	it('should apply gray color to duration when totalDuration is 0', () => {
		const { container } = render(DaySummaryCard, {
			props: {
				weekDay: { ...baseWeekDay, totalDuration: 0 },
				selected: false,
				disabled: false,
			},
		})

		const durationElement = container.querySelector('.text-2xl.font-semibold')
		expect(durationElement).toHaveClass('text-gray-400')
	})

	it('should apply secondary color to session count when sessionCount > 0', () => {
		const { container } = render(DaySummaryCard, {
			props: {
				weekDay: { ...baseWeekDay, sessionCount: 2 },
				selected: false,
				disabled: false,
			},
		})

		const sessionElement = container.querySelector('.text-xs.text-gray-500.mt-1')
		expect(sessionElement).toHaveClass('text-secondary')
	})

	it('should apply gray color to session count when sessionCount is 0', () => {
		const { container } = render(DaySummaryCard, {
			props: {
				weekDay: { ...baseWeekDay, sessionCount: 0 },
				selected: false,
				disabled: false,
			},
		})

		const sessionElement = container.querySelector('.text-xs.text-gray-500.mt-1')
		expect(sessionElement).toHaveClass('text-gray-400')
	})

	it('should emit selectDay event when clicked and not disabled', async () => {
		const user = userEvent.setup()
		const { emitted } = render(DaySummaryCard, {
			props: {
				weekDay: baseWeekDay,
				selected: false,
				disabled: false,
			},
		})

		const button = screen.getByRole('button')
		await user.click(button)

		expect(emitted()).toHaveProperty('selectDay')
		expect(emitted('selectDay')).toEqual([['2024-01-15']])
	})

	it('should not emit selectDay event when clicked and disabled', async () => {
		const user = userEvent.setup()
		const { emitted } = render(DaySummaryCard, {
			props: {
				weekDay: baseWeekDay,
				selected: false,
				disabled: true,
			},
		})

		const button = screen.getByRole('button')
		await user.click(button)

		expect(emitted()).not.toHaveProperty('selectDay')
	})

	it('should have correct accessibility attributes when selected', () => {
		render(DaySummaryCard, {
			props: {
				weekDay: baseWeekDay,
				selected: true,
				disabled: false,
			},
		})

		const button = screen.getByRole('button')
		expect(button).toHaveAttribute('aria-pressed', 'true')
		expect(button).toHaveAttribute('aria-disabled', 'false')
		expect(button).toHaveAttribute('tabindex', '0')
	})

	it('should have correct accessibility attributes when not selected', () => {
		render(DaySummaryCard, {
			props: {
				weekDay: baseWeekDay,
				selected: false,
				disabled: false,
			},
		})

		const button = screen.getByRole('button')
		expect(button).toHaveAttribute('aria-pressed', 'false')
		expect(button).toHaveAttribute('aria-disabled', 'false')
		expect(button).toHaveAttribute('tabindex', '0')
	})

	it('should have correct accessibility attributes when disabled', () => {
		render(DaySummaryCard, {
			props: {
				weekDay: baseWeekDay,
				selected: false,
				disabled: true,
			},
		})

		const button = screen.getByRole('button')
		expect(button).toHaveAttribute('aria-disabled', 'true')
		expect(button).toHaveAttribute('tabindex', '-1')
	})

	it('should display zero duration correctly', () => {
		const { container } = render(DaySummaryCard, {
			props: {
				weekDay: { ...baseWeekDay, totalDuration: 0 },
				selected: false,
				disabled: false,
			},
		})

		expect(container.querySelector('.text-2xl')?.textContent?.trim()).toBe('0:00:00')
	})

	it('should handle zero sessions correctly', () => {
		const { container } = render(DaySummaryCard, {
			props: {
				weekDay: { ...baseWeekDay, sessionCount: 0 },
				selected: false,
				disabled: false,
			},
		})

		// Get the session count element - it's the last .text-xs element
		const sessionElement = container.querySelector('.text-xs.text-gray-500.mt-1')
		expect(sessionElement?.textContent?.trim()).toBe('0 sessions')
	})
})
