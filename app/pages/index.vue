<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppCard from '~/components/AppCard.vue'
import SessionList from '~/components/SessionList.vue'
import TimerDisplay from '~/components/TimerDisplay.vue'
import { useTimeTracker } from '~/composables/useTimeTracker'
import { formatDuration } from '~/types'

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

// Date input handling
const selectedDateInput = ref(selectedDate.value)

watch(selectedDate, (newDate) => {
	selectedDateInput.value = newDate
})

function handleDateChange() {
	selectDate(selectedDateInput.value)
}

// Quick stats computations
const weeklyTotal = computed(() => {
	return dailyStats.value.reduce((total, day) => total + day.totalDuration, 0)
})

const dailyAverage = computed(() => {
	const total = weeklyTotal.value
	return Math.round(total / 7)
})

const totalWeeklySessions = computed(() => {
	return dailyStats.value.reduce((total, day) => total + day.sessionCount, 0)
})

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
				<h2 class="text-2xl font-bold text-center">Timer</h2>
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
						<input
							v-model="selectedDateInput"
							type="date"
							class="input input-bordered input-sm"
							:disabled="loading"
							@change="handleDateChange"
						>
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
