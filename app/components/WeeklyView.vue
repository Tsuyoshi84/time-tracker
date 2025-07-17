<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { computed } from 'vue'
import type { DateString, DayStats, WeekDay } from '~/types'
import { formatDate, formatDuration } from '~/types'
import AppCard from './AppCard.vue'
import DaySummaryCard from './DaySummaryCard.vue'

const props = withDefaults(
	defineProps<{
		/** The start date of the week. */
		weekStart: Date
		/** The end date of the week. */
		weekEnd: Date
		/** Array of daily statistics for the week. */
		dailyStats: DayStats[]
		/** The currently selected date (YYYY-MM-DD). */
		selectedDate: string
		/** Whether the data is loading. @default false */
		loading?: boolean
	}>(),
	{
		loading: false,
	},
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
	const current = new Date(props.weekStart)
	const today = formatDate(new Date())

	for (let i = 0; i < 7; i++) {
		const dateString = formatDate(current)

		const dayStats = props.dailyStats.find((stats) => stats.date === dateString)

		days.push({
			// biome-ignore lint/style/noNonNullAssertion: The value is guaranteed to be defined
			date: dateString!,
			dayName: current.toLocaleDateString('en-US', { weekday: 'short' }),
			isToday: dateString === today,
			totalDuration: dayStats?.totalDuration || 0,
			sessionCount: dayStats?.sessionCount || 0,
		})

		current.setDate(current.getDate() + 1)
	}

	return days
})

const weekTotal = computed<number>(() => {
	return props.dailyStats.reduce((total, day) => total + day.totalDuration, 0)
})

const totalSessions = computed<number>(() => {
	return props.dailyStats.reduce((total, day) => total + day.sessionCount, 0)
})

function formatWeekRange(start: Date, end: Date): string {
	const startStr = start.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
	})
	const endStr = end.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
	})
	return `${startStr} - ${endStr}`
}
</script>

<template>
	<div class="space-y-6">
		<div class="flex items-center justify-between">
			<h2 class="text-xl font-semibold">Weekly Overview</h2>
			<div class="flex items-center space-x-2">
				<button
					type="button"
					class="btn btn-sm btn-outline"
					:disabled="loading"
					@click="$emit('previousWeek')"
				>
					<ChevronLeft class="w-4 h-4" />
				</button>
				<span class="text-sm font-medium px-3">
					{{ formatWeekRange(weekStart, weekEnd) }}
				</span>
				<button
					type="button"
					class="btn btn-sm btn-outline"
					:disabled="loading"
					@click="$emit('nextWeek')"
				>
					<ChevronRight class="w-4 h-4" />
				</button>
			</div>
		</div>

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

		<AppCard>
			<div class="text-center">
				<div class="text-sm text-gray-600 mb-1">Week Total</div>
				<div class="text-3xl font-bold text-primary">
					{{ formatDuration(weekTotal) }}
				</div>
				<div class="text-sm text-gray-500 mt-1">
					{{ totalSessions }} total sessions
				</div>
			</div>
		</AppCard>
	</div>
</template>
