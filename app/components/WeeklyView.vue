<script setup lang="ts">
import { Temporal } from '@js-temporal/polyfill'
import { computed } from 'vue'
import type { DateString, DayStats, WeekDay } from '~/types/index.ts'
import { convertToDateString } from '~/utils/convertToDateString.ts'
import { formatDuration } from '~/utils/formatDuration.ts'
import AppCard from './AppCard.vue'
import DaySummaryCard from './DaySummaryCard.vue'
import WeekRangeButtons from './WeekRangeButtons.vue'

const props = withDefaults(
	defineProps<{
		/** The start date of the week. */
		weekStart: Temporal.PlainDate
		/** The end date of the week. */
		weekEnd: Temporal.PlainDate
		/** Array of daily statistics for the week. */
		dailyStats: DayStats[]
		/** The currently selected date (YYYY-MM-DD). */
		selectedDate: string
		/** Whether the data is loading. @default false */
		loading?: boolean
	}>(),
	{
		loading: false,
	}
)

defineEmits<{
	/** Emitted when the user requests the previous week. */
	previousWeek: []
	/** Emitted when the user requests the next week. */
	nextWeek: []
	/** Emitted when a day is selected, with the date (YYYY-MM-DD). */
	selectDay: [date: DateString]
}>()

const weekDays = computed<WeekDay[]>(() => {
	const days: WeekDay[] = []
	let current = props.weekStart
	const today = convertToDateString(Temporal.Now.plainDateISO())

	for (let i = 0; i < 7; i++) {
		const dateString = convertToDateString(current)
		const dayStats = props.dailyStats.find((stats) => stats.date === dateString)

		// Get weekday name using Temporal.PlainDate
		const dayName = current.toLocaleString('en-US', { weekday: 'short' })

		days.push({
			date: dateString,
			dayName,
			isToday: dateString === today,
			totalDuration: dayStats?.totalDuration || 0,
			sessionCount: dayStats?.sessionCount || 0,
		})

		current = current.add({ days: 1 })
	}

	return days
})

const weekTotal = computed<number>(() => {
	return props.dailyStats.reduce((total, day) => total + day.totalDuration, 0)
})

const totalSessions = computed<number>(() => {
	return props.dailyStats.reduce((total, day) => total + day.sessionCount, 0)
})
</script>

<template>
	<div class="space-y-4">
		<WeekRangeButtons
			:loading="loading"
			:start="weekStart"
			:end="weekEnd"
			@previous-week="$emit('previousWeek')"
			@next-week="$emit('nextWeek')"
		/>

		<AppCard>
			<div class="text-center">
				<div class="text-sm text-gray-600 mb-1">Week Total</div>
				<div class="text-3xl font-bold text-primary">
					{{ formatDuration(weekTotal) }}
				</div>
				<div class="text-sm text-gray-500 mt-1"> {{ totalSessions }} total sessions </div>
			</div>
		</AppCard>

		<div class="grid grid-cols-1 sm:grid-cols-7 gap-1 sm:gap-1">
			<DaySummaryCard
				v-for="day in weekDays"
				:key="day.date"
				:week-day="day"
				:selected="selectedDate === day.date"
				:disabled="loading"
				@select-day="$emit('selectDay', $event)"
			/>
		</div>
	</div>
</template>
