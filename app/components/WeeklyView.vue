<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">Weekly Overview</h2>
      <div class="flex items-center space-x-2">
        <button
          @click="previousWeek"
          class="btn btn-sm btn-outline"
          :disabled="loading"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>
        <span class="text-sm font-medium px-3">
          {{ formatWeekRange(weekStart, weekEnd) }}
        </span>
        <button
          @click="nextWeek"
          class="btn btn-sm btn-outline"
          :disabled="loading"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div class="weekly-grid">
      <div
        v-for="day in weekDays"
        :key="day.date"
        @click="selectDay(day.date)"
        :class="[
          'day-card',
          {
            selected: selectedDate === day.date,
            today: day.isToday,
          },
        ]"
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

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { computed } from 'vue'
import type { DayStats } from '~/types'
import { formatDuration } from '~/types'

// Props
interface Props {
	weekStart: Date
	weekEnd: Date
	dailyStats: DayStats[]
	selectedDate: string
	loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	loading: false,
})

// Emits
const emit = defineEmits<{
	previousWeek: []
	nextWeek: []
	selectDay: [date: string]
}>()

// Computed
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

// Methods
const previousWeek = () => {
	emit('previousWeek')
}

const nextWeek = () => {
	emit('nextWeek')
}

const selectDay = (date: string) => {
	emit('selectDay', date)
}

const formatWeekRange = (start: Date, end: Date): string => {
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

const formatDate = (dateString: string): string => {
	const date = new Date(dateString)
	return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })
}
</script>
