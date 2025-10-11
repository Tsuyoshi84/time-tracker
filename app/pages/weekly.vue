<script setup lang="ts">
import { useSum } from '@vueuse/math'
import { Calendar } from 'lucide-vue-next'
import { computed } from 'vue'
import AppCard from '~/components/AppCard.vue'
import WeeklyView from '~/components/WeeklyView.vue'
import { useTimeTracker } from '~/composables/useTimeTracker.ts'
import type { TimeSession } from '~/types/index.ts'
import { calculateDuration } from '~/utils/calculateDuration.ts'
import { formatDuration } from '~/utils/formatDuration.ts'
import { formatTime } from '~/utils/formatTime.ts'

const { selectedDate, weekStart, weekEnd, dailyStats, loading, navigateWeek, selectDate } =
	useTimeTracker()

// Selected day details
const selectedDayStats = computed(() => {
	return dailyStats.value.find((day) => day.date === selectedDate.value)
})

const weeklyTotal = useSum(() => dailyStats.value.map((a) => a.totalDuration))

const dailyAverage = computed<number>(() => Math.round(weeklyTotal.value / 7))

const totalWeeklySessions = useSum(() => dailyStats.value.map((a) => a.sessionCount))

const mostProductiveDay = computed<string>(() => {
	if (dailyStats.value.length === 0) return 'None'

	const maxDay = dailyStats.value.reduce((max, day) =>
		day.totalDuration > max.totalDuration ? day : max
	)

	if (maxDay.totalDuration === 0) return 'None'

	const date = new Date(maxDay.date)
	return date.toLocaleDateString('en-US', { weekday: 'long' })
})

const formattedSelectedDate = computed<string>(() => {
	const date = new Date(selectedDate.value)
	return date.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})
})

function getSessionDuration(session: TimeSession): string {
	if (session.isActive) {
		return 'Running...'
	}

	if (session.endTime) {
		const duration = calculateDuration(session.startTime, session.endTime)
		return formatDuration(duration)
	}

	return '--:--:--'
}
</script>

<template>
	<div class="max-w-6xl mx-auto">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-center mb-2">Weekly Overview</h1>
			<p class="text-center text-gray-600">
				Track your weekly progress and analyze your work patterns
			</p>
		</div>

		<WeeklyView
			:week-start="weekStart"
			:week-end="weekEnd"
			:daily-stats="dailyStats"
			:selected-date="selectedDate"
			:loading="loading"
			@previous-week="navigateWeek.prev"
			@next-week="navigateWeek.next"
			@select-day="selectDate"
		/>

		<!-- Selected Day Details -->
		<div
			v-if="selectedDayStats"
			class="mt-4"
		>
			<div class="bg-base-100 rounded-lg p-6 shadow-sm border border-base-300">
				<h3 class="text-xl font-semibold mb-4"> {{ formattedSelectedDate }} - Sessions </h3>

				<div
					v-if="selectedDayStats.sessions.length === 0"
					class="text-center py-8 text-gray-500"
				>
					<Calendar class="w-12 h-12 mx-auto mb-2 opacity-50" />
					<p>No sessions for this day</p>
				</div>

				<div
					v-else
					class="space-y-3"
				>
					<div
						v-for="session in selectedDayStats.sessions"
						:key="session.id"
						class="flex items-center justify-between p-4 bg-base-200 rounded-lg"
					>
						<div class="flex items-center space-x-4">
							<div class="flex items-center">
								<div
									:class="[
										'w-3 h-3 rounded-full',
										session.isActive ? 'bg-green-500' : 'bg-gray-300',
									]"
								/>
								<span class="ml-2 text-sm font-medium">
									{{ session.isActive ? 'Active' : 'Completed' }}
								</span>
							</div>

							<div class="flex items-center space-x-2">
								<span class="text-sm font-mono">{{ formatTime(session.startTime) }}</span>
								<span class="text-gray-400">-</span>
								<span class="text-sm font-mono">
									{{ session.endTime ? formatTime(session.endTime) : 'Running...' }}
								</span>
							</div>
						</div>

						<div class="text-sm font-mono text-gray-600">
							{{ getSessionDuration(session) }}
						</div>
					</div>

					<div class="pt-4 border-t border-base-300">
						<div class="flex justify-between items-center">
							<span class="font-semibold">Total for {{ formattedSelectedDate }}:</span>
							<span class="text-lg font-bold text-primary">
								{{ formatDuration(selectedDayStats.totalDuration) }}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Weekly Stats Summary -->
		<div class="mt-4 grid grid-cols-1 md:grid-cols-4 gap-6">
			<AppCard class="text-center">
				<div class="text-sm text-gray-600 mb-1">Total Hours</div>
				<div class="text-2xl font-bold text-primary">
					{{ formatDuration(weeklyTotal) }}
				</div>
			</AppCard>
			<AppCard class="text-center">
				<div class="text-sm text-gray-600 mb-1">Daily Average</div>
				<div class="text-2xl font-bold text-secondary">
					{{ formatDuration(dailyAverage) }}
				</div>
			</AppCard>
			<AppCard class="text-center">
				<div class="text-sm text-gray-600 mb-1">Most Productive Day</div>
				<div class="text-lg font-bold text-accent">
					{{ mostProductiveDay }}
				</div>
			</AppCard>
			<AppCard class="text-center">
				<div class="text-sm text-gray-600 mb-1">Total Sessions</div>
				<div class="text-2xl font-bold text-warning">
					{{ totalWeeklySessions }}
				</div>
			</AppCard>
		</div>
	</div>
</template>
