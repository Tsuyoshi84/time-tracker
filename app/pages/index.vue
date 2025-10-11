<script setup lang="ts">
import { useRound, useSum } from '@vueuse/math'
import { shallowRef, watch } from 'vue'
import AppCard from '~/components/AppCard.vue'
import AppDateInput from '~/components/AppDateInput.vue'
import SessionList from '~/components/SessionList.vue'
import TimerDisplay from '~/components/TimerDisplay.vue'
import { useTimeTracker } from '~/composables/useTimeTracker.ts'
import { formatDuration } from '~/utils/formatDuration.ts'

// Use the time tracker composable
const {
	timerState,
	sessions,
	selectedDate,
	dailyStats,
	loading,
	error,
	currentSessionDuration,
	todaysTotalDuration,
	sessionCount,
	toggleTimer,
	updateSessionData,
	deleteSessionData,
	addManualSession,
	selectDate,
} = useTimeTracker()

const selectedDateInput = shallowRef(selectedDate.value)

watch(selectedDate, (newDate) => {
	selectedDateInput.value = newDate
})

function handleDateChange() {
	selectDate(selectedDateInput.value)
}

const weeklyTotal = useSum(() => dailyStats.value.map((day) => day.totalDuration))

const dailyAverage = useRound(() => weeklyTotal.value / 7)

const totalWeeklySessions = useSum(() => dailyStats.value.map((day) => day.sessionCount))

// SEO
useSeoMeta({
	title: 'Time Tracker - Freelance Time Management',
	description: 'Track your freelance work hours with flexible timer and session management',
})
</script>

<template>
	<div class="max-w-6xl mx-auto">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<!-- Timer Section -->
			<div class="space-y-6">
				<TimerDisplay
					:is-running="timerState.isRunning"
					:current-session-duration="currentSessionDuration"
					:todays-total-duration="todaysTotalDuration"
					:session-count="sessionCount"
					:loading="loading"
					:error="error"
					@toggle-timer="toggleTimer"
				/>
			</div>

			<!-- Daily Sessions Section -->
			<div class="space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="text-2xl font-bold">Today's Sessions</h2>
					<div class="flex items-center space-x-2">
						<AppDateInput v-model="selectedDateInput" />
					</div>
				</div>

				<SessionList
					:sessions="sessions"
					:loading="loading"
					@update-session="updateSessionData"
					@delete-session="deleteSessionData"
					@add-manual-session="addManualSession"
				/>
			</div>
		</div>

		<!-- Quick Stats -->
		<div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
			<AppCard class="text-center">
				<div class="text-sm text-gray-600 mb-1">This Week</div>
				<div class="text-2xl font-bold text-primary">
					{{ formatDuration(weeklyTotal) }}
				</div>
			</AppCard>
			<AppCard class="text-center">
				<div class="text-sm text-gray-600 mb-1">Average/Day</div>
				<div class="text-2xl font-bold text-secondary">
					{{ formatDuration(dailyAverage) }}
				</div>
			</AppCard>
			<AppCard class="text-center">
				<div class="text-sm text-gray-600 mb-1">Total Sessions</div>
				<div class="text-2xl font-bold text-accent">
					{{ totalWeeklySessions }}
				</div>
			</AppCard>
		</div>
	</div>
</template>
