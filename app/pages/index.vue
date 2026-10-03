<script setup lang="ts">
import { useSum } from '@vueuse/math'

import AppDateInput from '~/components/AppDateInput.vue'
import SessionList from '~/components/SessionList.vue'
import TimerDisplay from '~/components/TimerDisplay.vue'
import { useSessionManager } from '~/composables/useSessionManager.ts'
import { useTimerState } from '~/composables/useTimerState.ts'
import { useWeeklyStats } from '~/composables/useWeeklyStats.ts'
import { getSessionsByDate } from '~/database/database.ts'
import type { Milliseconds, TimeSession } from '~/types/index.ts'
import { calculateTodaysTotalDuration } from '~/utils/calculateTodaysTotalDuration.ts'
import { convertToDateString } from '~/utils/convertToDateString.ts'

const { dailyStats, loadWeeklyStats } = useWeeklyStats()

const { loadActiveSession, timerState, currentSessionDuration, toggleTimer } = useTimerState()

const todaysSessions = shallowRef<TimeSession[]>([])

async function loadTodaysSessions(): Promise<void> {
	const today = convertToDateString(new Date())
	todaysSessions.value = await getSessionsByDate(today)
}

const {
	sessions,
	selectedDate,
	updateSessionData,
	deleteSessionData,
	createSession,
	errorMessage,
	clearError,
	loadSessionsForDate,
	loading: sessionLoading,
} = useSessionManager(async () => {
	await Promise.all([loadWeeklyStats(), loadActiveSession(), loadTodaysSessions()])
})

const sessionListRef = useTemplateRef('sessionListRef')

async function handleCreateSession(payload: { startTime: Date; endTime: Date }): Promise<void> {
	await createSession(payload.startTime, payload.endTime)
	if (!errorMessage.value) {
		sessionListRef.value?.closeModal()
	}
}

async function handleUpdateSession(
	session: Parameters<typeof updateSessionData>[0],
	updates: Parameters<typeof updateSessionData>[1],
): Promise<void> {
	await updateSessionData(session, updates)
	if (!errorMessage.value) {
		sessionListRef.value?.closeModal()
	}
}

// Load sessions and stats on mount
onMounted(async () => {
	await Promise.all([
		loadActiveSession(),
		loadSessionsForDate(selectedDate.value),
		loadWeeklyStats(),
		loadTodaysSessions(),
	])
})

watch(
	() => timerState.value.isRunning,
	async () => {
		await Promise.all([
			loadSessionsForDate(selectedDate.value),
			loadWeeklyStats(),
			loadTodaysSessions(),
		])
	},
)

const todaysTotalDuration = computed<Milliseconds>(() => {
	const today = convertToDateString(new Date())
	return calculateTodaysTotalDuration(todaysSessions.value, today, currentSessionDuration.value)
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
					@toggle-timer="toggleTimer"
				/>
			</div>

			<!-- Daily Sessions Section -->
			<div class="space-y-6">
				<div class="flex items-center justify-between">
					<AppDateInput v-model="selectedDate" />
				</div>

				<SessionList
					ref="sessionListRef"
					:sessions="sessions"
					:selected-date="selectedDate"
					:loading="sessionLoading"
					:save-error="errorMessage"
					@update-session="handleUpdateSession"
					@create-session="handleCreateSession"
					@delete-session="deleteSessionData"
					@clear-save-error="clearError"
				/>
			</div>
		</div>
	</div>
</template>
