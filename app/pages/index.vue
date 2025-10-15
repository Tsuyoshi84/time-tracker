<script setup lang="ts">
import { useSum } from '@vueuse/math'
import { computed, onMounted, shallowRef, watch } from 'vue'
import AppDateInput from '~/components/AppDateInput.vue'
import SessionList from '~/components/SessionList.vue'
import TimerDisplay from '~/components/TimerDisplay.vue'
import { useSessionManager } from '~/composables/useSessionManager.ts'
import { useTimerState } from '~/composables/useTimerState.ts'
import { useWeeklyStats } from '~/composables/useWeeklyStats.ts'
import type { Milliseconds } from '~/types/index.ts'
import { convertToDateString } from '~/utils/convertToDateString.ts'
import { initDatabase } from '~/utils/database.ts'

const { dailyStats, loadWeeklyStats } = useWeeklyStats()

const { loadActiveSession, timerState, currentSessionDuration, toggleTimer, loading } =
	useTimerState()

const {
	sessions,
	selectedDate,
	updateSessionData,
	deleteSessionData,
	addManualSession,
	selectDate,
	loadSessionsForDate,
} = useSessionManager(async () => {
	await loadWeeklyStats()
})

// Initialize on mount
onMounted(async () => {
	initDatabase()
	await loadActiveSession()
	await loadSessionsForDate(selectedDate.value)
	await loadWeeklyStats()
})

watch(
	() => timerState.value.isRunning,
	async () => {
		await loadSessionsForDate(selectedDate.value)
		await loadWeeklyStats()
	},
)

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

const weekTotalDuration = computed<Milliseconds>(
	() => (totalDurationExcludingCurrentSession.value + currentSessionDuration.value) as Milliseconds,
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
					:week-total-duration="weekTotalDuration"
					:loading="loading"
					@toggle-timer="toggleTimer"
				/>
			</div>

			<!-- Daily Sessions Section -->
			<div class="space-y-6">
				<div class="flex items-center justify-between">
					<AppDateInput v-model="selectedDateInput" />
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
	</div>
</template>
