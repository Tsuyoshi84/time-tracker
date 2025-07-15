<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { computed } from 'vue'
import type { DayStats } from '~/types'
import { formatDuration } from '~/types'

const props = withDefaults(
	defineProps<{
		weekStart: Date
		weekEnd: Date
		dailyStats: DayStats[]
		selectedDate: string
		loading?: boolean
	}>(),
	{
		loading: false,
	},
)

defineEmits<{
	previousWeek: []
	nextWeek: []
	selectDay: [date: string]
}>()

const weekDays = computed<
	{
		date: string
		dayName: string
		isToday: boolean
		totalDuration: number
		sessionCount: number
	}[]
>(() => {
	const days = []
	const current = new Date(props.weekStart)
	const today = new Date().toISOString().split('T')[0]

	for (let i = 0; i < 7; i++) {
		const dateString = current.toISOString().split('T')[0]
		const dayStats = props.dailyStats.find((stats) => stats.date === dateString)

		days.push({
			date: dateString as string,
			dayName: current.toLocaleDateString('en-US', { weekday: 'short' }),
			isToday: dateString === today,
			totalDuration: dayStats?.totalDuration || 0,
			sessionCount: dayStats?.sessionCount || 0,
		})

		current.setDate(current.getDate() + 1)
	}

	return days
})

const weekTotal = computed(() => {
	return props.dailyStats.reduce((total, day) => total + day.totalDuration, 0)
})

const totalSessions = computed(() => {
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

function formatDate(dateString: string): string {
	const date = new Date(dateString)
	return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })
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

    <div class="grid weekly-grid grid-cols-1 gap-1 sm:grid-cols-1 sm:gap-1">
      <div
        v-for="day in weekDays"
        :key="day.date"
        class="bg-base-100 border border-base-300 rounded-lg p-3 text-center hover:bg-base-200 transition-colors cursor-pointer"
        :class="{
          'border-primary bg-primary opacity-10': selectedDate === day.date,
          'border-secondary bg-secondary opacity-10': day.isToday,
        }"
        @click="$emit('selectDay', day.date)"
      >
        <div class="text-sm font-medium mb-1">
          {{ day.dayName }}
        </div>
        <div class="text-xs text-gray-500 mb-2">
          {{ formatDate(day.date) }}
        </div>
        <div class="text-lg font-semibold text-primary">
          {{ formatDuration(day.totalDuration) }}
        </div>
        <div class="text-xs text-gray-500 mt-1">
          {{ day.sessionCount }} session{{ day.sessionCount !== 1 ? "s" : "" }}
        </div>
      </div>
    </div>

    <div class="stats-card">
      <div class="text-center">
        <div class="text-sm text-gray-600 mb-1">Week Total</div>
        <div class="text-3xl font-bold text-primary">
          {{ formatDuration(weekTotal) }}
        </div>
        <div class="text-sm text-gray-500 mt-1">
          {{ totalSessions }} total sessions
        </div>
      </div>
    </div>
  </div>
</template>
