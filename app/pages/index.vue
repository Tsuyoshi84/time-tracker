<script setup lang="ts">
import { useSum } from '@vueuse/math'
import { computed, onMounted, shallowRef, watch } from 'vue'
import AppCard from '~/components/AppCard.vue'
import AppDateInput from '~/components/AppDateInput.vue'
import SessionList from '~/components/SessionList.vue'
import TimerDisplay from '~/components/TimerDisplay.vue'
import { useSessionManager } from '~/composables/useSessionManager.ts'
import { useTimerState } from '~/composables/useTimerState.ts'
import { useWeeklyStats } from '~/composables/useWeeklyStats.ts'
import type { Milliseconds } from '~/types/index.ts'
import { convertToDateString } from '~/utils/convertToDateString.ts'
import { initDatabase } from '~/utils/database.ts'
import { formatDuration } from '~/utils/formatDuration.ts'

// Initialize composables with coordination callbacks
const weeklyStats = useWeeklyStats()

const sessionManager = useSessionManager(async () => {
	await weeklyStats.loadWeeklyStats()
})

const timerStateManager = useTimerState(async () => {
	await sessionManager.loadSessionsForDate(sessionManager.selectedDate.value)
	await weeklyStats.loadWeeklyStats()
})

// Initialize on mount
onMounted(async () => {
	initDatabase()
	await timerStateManager.loadActiveSession()
	await sessionManager.loadSessionsForDate(sessionManager.selectedDate.value)
	await weeklyStats.loadWeeklyStats()
})

// Extract values from composables
const { timerState, currentSessionDuration, toggleTimer } = timerStateManager
const {
	sessions,
	selectedDate,
	updateSessionData,
	deleteSessionData,
	addManualSession,
	selectDate,
} = sessionManager
const { dailyStats } = weeklyStats

// Combined loading and error states
const loading = computed(() => timerStateManager.loading.value || sessionManager.loading.value)
const error = computed(
	() => timerStateManager.error.value || sessionManager.error.value || weeklyStats.error.value,
)

// Computed values
const todaysTotalDuration = computed<Milliseconds>(() => {
	const today = convertToDateString(new Date())
	const todaySessions = sessions.value.filter((s) => s.date === today && s.endTime)
	return (currentSessionDuration.value +
		todaySessions.reduce(
			(total, session) =>
				session.endTime ? total + (session.endTime.getTime() - session.startTime.getTime()) : total,
			0,
		)) as Milliseconds
})

const sessionCount = computed(() => {
	const today = convertToDateString(new Date())
	return sessions.value.filter((s) => s.date === today).length
})

const selectedDateInput = shallowRef(selectedDate.value)

watch(selectedDate, (newDate) => {
	selectedDateInput.value = newDate
})

watch(selectedDateInput, () => {
	selectDate(selectedDateInput.value)
})

const totalDurationExcludingCurrentSession = useSum(() =>
	dailyStats.value.map((day) => day.totalDuration),
)

const totalDurationIncludingCurrentSession = computed(
	() => totalDurationExcludingCurrentSession.value + currentSessionDuration.value,
)

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
				<div class="text-sm text-secondary mb-1">This Week</div>
				<div class="text-2xl font-bold text-primary">
					{{ formatDuration(totalDurationIncludingCurrentSession) }}
				</div>
			</AppCard>
		</div>
	</div>
</template>
