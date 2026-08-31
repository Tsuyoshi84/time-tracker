<script setup lang="ts">
/**
 * MonthlyDayRow displays one day's total hours and 24-hour work timeline in a single row.
 */

import { getDayOfWeek } from '@internationalized/date'

import DayWorkTimeline from '~/components/DayWorkTimeline.vue'
import type { DayStats } from '~/types/index.ts'
import { dateStringToCalendarDate } from '~/utils/dateStringToCalendarDate.ts'
import { formatDuration } from '~/utils/formatDuration.ts'

const props = defineProps<{
	/** Daily statistics for the row. */
	dayStats: DayStats
}>()

const calendarDate = computed(() => dateStringToCalendarDate(props.dayStats.date))

const dayLabel = computed<string>(() => {
	const { year, month, day } = calendarDate.value
	const weekday = new Date(year, month - 1, day).toLocaleDateString('en-US', { weekday: 'short' })

	return `${day} (${weekday})`
})

const weekdayTextColor = computed<string>(() => {
	const weekday = getDayOfWeek(calendarDate.value, 'en-US')

	if (weekday === 0) {
		return 'text-error'
	}

	if (weekday === 6) {
		return 'text-info'
	}

	return 'text-toned'
})

const hasWork = computed<boolean>(() => props.dayStats.totalDuration > 0)

const accessibleLabel = computed<string>(() => {
	const [year, month, day] = props.dayStats.date.split('-').map(Number)
	const localDate = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1)
	const weekday = localDate.toLocaleDateString('en-US', { weekday: 'long' })
	const monthDay = localDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

	return `${monthDay}, ${weekday}, ${formatDuration(props.dayStats.totalDuration)} worked`
})
</script>

<template>
	<div
		class="flex items-center gap-3 py-2 min-w-0"
		:aria-label="accessibleLabel"
	>
		<span
			class="w-[5.75rem] shrink-0 text-sm font-semibold tabular-nums whitespace-nowrap"
			:class="weekdayTextColor"
			aria-hidden="true"
		>
			{{ dayLabel }}
		</span>

		<span
			class="w-[4.75rem] shrink-0 text-sm font-mono tabular-nums"
			:class="hasWork ? 'text-default font-medium' : 'text-dimmed'"
			aria-hidden="true"
		>
			{{ formatDuration(props.dayStats.totalDuration) }}
		</span>

		<DayWorkTimeline
			class="flex-1 min-w-0"
			:sessions="props.dayStats.sessions"
			:day-date="props.dayStats.date"
		/>
	</div>
</template>
