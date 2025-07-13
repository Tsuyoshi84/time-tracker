import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { DayStats, TimerState, TimeSession } from '../types'
import { formatDate } from '../types'
import {
	checkForOverlappingSessions,
	deleteSession as deleteSessionFromDB,
	getActiveSession,
	getSessionsByDate,
	getSessionsInDateRange,
	initDatabase,
	saveSession,
	updateSession,
} from '../utils/database'

export function useTimeTracker() {
	// Reactive state
	const timerState = ref<TimerState>({
		isRunning: false,
		currentSession: null,
		startTime: null,
	})

	const sessions = ref<TimeSession[]>([])
	const selectedDate = ref<string>(formatDate(new Date()))
	const weekStart = ref<Date>(getStartOfWeek(new Date()))
	const weekEnd = ref<Date>(getEndOfWeek(new Date()))
	const dailyStats = ref<DayStats[]>([])
	const loading = ref(false)
	const error = ref<string>('')

	// Timer for real-time updates
	let timerInterval: number | null = null

	// Computed properties
	const currentSessionDuration = computed(() => {
		if (!timerState.value.isRunning || !timerState.value.startTime) return 0
		return Date.now() - timerState.value.startTime.getTime()
	})

	const todaysTotalDuration = computed(() => {
		const today = formatDate(new Date())
		const todaySessions = sessions.value.filter((s) => s.date === today && s.endTime)
		return todaySessions.reduce((total, session) => {
			if (session.endTime) {
				return total + (session.endTime.getTime() - session.startTime.getTime())
			}
			return total
		}, 0)
	})

	const sessionCount = computed(() => {
		const today = formatDate(new Date())
		return sessions.value.filter((s) => s.date === today).length
	})

	// Methods
	async function initializeTimer() {
		try {
			loading.value = true
			await initDatabase()
			await loadActiveSession()
			await loadSessionsForDate(selectedDate.value)
			await loadWeeklyStats()
			startTimerInterval()
		} catch (err) {
			error.value = `Failed to initialize: ${err instanceof Error ? err.message : 'Unknown error'}`
		} finally {
			loading.value = false
		}
	}

	async function loadActiveSession() {
		try {
			const activeSession = await getActiveSession()
			if (activeSession) {
				timerState.value = {
					isRunning: true,
					currentSession: activeSession,
					startTime: activeSession.startTime,
				}
			}
		} catch (err) {
			error.value = `Failed to load active session: ${
				err instanceof Error ? err.message : 'Unknown error'
			}`
		}
	}

	async function toggleTimer() {
		try {
			loading.value = true
			error.value = ''

			if (timerState.value.isRunning) {
				await pauseTimer()
			} else {
				await startTimer()
			}
		} catch (err) {
			error.value = `Timer error: ${err instanceof Error ? err.message : 'Unknown error'}`
		} finally {
			loading.value = false
		}
	}

	async function startTimer() {
		const now = new Date()
		const sessionData = {
			startTime: now,
			date: formatDate(now),
			isActive: true,
			duration: 0,
			createdAt: now,
			updatedAt: now,
		}

		const newSession = await saveSession(sessionData)

		timerState.value = {
			isRunning: true,
			currentSession: newSession,
			startTime: now,
		}

		await refreshCurrentDateSessions()
	}

	async function pauseTimer() {
		if (!timerState.value.currentSession) return

		const endTime = new Date()
		const duration = endTime.getTime() - timerState.value.currentSession.startTime.getTime()

		await updateSession(timerState.value.currentSession.id, {
			endTime,
			duration,
			isActive: false,
		})

		timerState.value = {
			isRunning: false,
			currentSession: null,
			startTime: null,
		}

		await refreshCurrentDateSessions()
	}

	async function loadSessionsForDate(date: string) {
		try {
			const dateSessions = await getSessionsByDate(date)
			sessions.value = dateSessions
		} catch (err) {
			error.value = `Failed to load sessions: ${err instanceof Error ? err.message : 'Unknown error'}`
		}
	}

	async function refreshCurrentDateSessions() {
		await loadSessionsForDate(selectedDate.value)
	}

	async function updateSessionData(session: TimeSession, updates: Partial<TimeSession>) {
		try {
			loading.value = true
			error.value = ''

			// Validate overlapping sessions if updating times
			if (updates.startTime || updates.endTime) {
				const startTime = updates.startTime || session.startTime
				const endTime = updates.endTime || session.endTime

				if (endTime) {
					const overlapping = await checkForOverlappingSessions(startTime, endTime, session.id)
					if (overlapping.length > 0) {
						throw new Error('This time range overlaps with existing sessions')
					}
				}
			}

			await updateSession(session.id, updates)
			await refreshCurrentDateSessions()
			await loadWeeklyStats()
		} catch (err) {
			error.value = `Failed to update session: ${
				err instanceof Error ? err.message : 'Unknown error'
			}`
		} finally {
			loading.value = false
		}
	}

	async function deleteSessionData(session: TimeSession) {
		try {
			loading.value = true
			error.value = ''

			await deleteSessionFromDB(session.id)
			await refreshCurrentDateSessions()
			await loadWeeklyStats()
		} catch (err) {
			error.value = `Failed to delete session: ${
				err instanceof Error ? err.message : 'Unknown error'
			}`
		} finally {
			loading.value = false
		}
	}

	async function addManualSession() {
		const now = new Date()
		const startTime = new Date(now.getTime() - 60 * 60 * 1000) // 1 hour ago
		const endTime = now

		const sessionData = {
			startTime,
			endTime,
			date: formatDate(startTime),
			isActive: false,
			duration: endTime.getTime() - startTime.getTime(),
			createdAt: now,
			updatedAt: now,
		}

		try {
			loading.value = true
			error.value = ''

			const overlapping = await checkForOverlappingSessions(startTime, endTime)
			if (overlapping.length > 0) {
				throw new Error(
					'Default time range overlaps with existing sessions. Please edit the times.',
				)
			}

			await saveSession(sessionData)
			await refreshCurrentDateSessions()
			await loadWeeklyStats()
		} catch (err) {
			error.value = `Failed to add session: ${err instanceof Error ? err.message : 'Unknown error'}`
		} finally {
			loading.value = false
		}
	}

	async function loadWeeklyStats() {
		try {
			const weekStartStr = formatDate(weekStart.value)
			const weekEndStr = formatDate(weekEnd.value)

			const weekSessions = await getSessionsInDateRange(weekStartStr, weekEndStr)

			// Group sessions by date
			const sessionsByDate = new Map<string, TimeSession[]>()
			for (const session of weekSessions) {
				const date = session.date
				if (!sessionsByDate.has(date)) {
					sessionsByDate.set(date, [])
				}
				sessionsByDate.get(date)?.push(session)
			}

			// Calculate daily stats
			const stats: DayStats[] = []
			const currentDate = new Date(weekStart.value)

			for (let i = 0; i < 7; i++) {
				const dateStr = formatDate(currentDate)
				const daySessions = sessionsByDate.get(dateStr) || []

				const completedSessions = daySessions.filter((s) => s.endTime)
				const totalDuration = completedSessions.reduce((total, session) => {
					if (session.endTime) {
						return total + (session.endTime.getTime() - session.startTime.getTime())
					}
					return total
				}, 0)

				stats.push({
					date: dateStr,
					totalDuration,
					sessionCount: daySessions.length,
					sessions: daySessions,
				})

				currentDate.setDate(currentDate.getDate() + 1)
			}

			dailyStats.value = stats
		} catch (err) {
			error.value = `Failed to load weekly stats: ${
				err instanceof Error ? err.message : 'Unknown error'
			}`
		}
	}

	async function selectDate(date: string) {
		selectedDate.value = date
		await loadSessionsForDate(date)
	}

	async function navigateWeek(direction: 'prev' | 'next') {
		const days = direction === 'prev' ? -7 : 7
		weekStart.value = new Date(weekStart.value.getTime() + days * 24 * 60 * 60 * 1000)
		weekEnd.value = new Date(weekEnd.value.getTime() + days * 24 * 60 * 60 * 1000)
		await loadWeeklyStats()
	}

	function startTimerInterval() {
		if (timerInterval) clearInterval(timerInterval)
		timerInterval = window.setInterval(() => {
			// Force reactivity update for real-time timer display
			if (timerState.value.isRunning) {
				// biome-ignore lint/correctness/noSelfAssign: This triggers reactivity
				timerState.value.startTime = timerState.value.startTime
			}
		}, 1000)
	}

	function stopTimerInterval() {
		if (timerInterval) {
			clearInterval(timerInterval)
			timerInterval = null
		}
	}

	// Lifecycle
	onMounted(() => {
		initializeTimer()
	})

	onUnmounted(() => {
		stopTimerInterval()
	})

	return {
		// State
		timerState: computed(() => timerState.value),
		sessions: computed(() => sessions.value),
		selectedDate: computed(() => selectedDate.value),
		weekStart: computed(() => weekStart.value),
		weekEnd: computed(() => weekEnd.value),
		dailyStats: computed(() => dailyStats.value),
		loading: computed(() => loading.value),
		error: computed(() => error.value),

		// Computed
		currentSessionDuration,
		todaysTotalDuration,
		sessionCount,

		// Methods
		toggleTimer,
		updateSessionData,
		deleteSessionData,
		addManualSession,
		selectDate,
		navigateWeek: {
			prev: () => navigateWeek('prev'),
			next: () => navigateWeek('next'),
		},
	}
}

// Helper functions
function getStartOfWeek(date: Date): Date {
	const result = new Date(date)
	const day = result.getDay()
	const diff = result.getDate() - day
	result.setDate(diff)
	result.setHours(0, 0, 0, 0)
	return result
}

function getEndOfWeek(date: Date): Date {
	const result = new Date(date)
	const day = result.getDay()
	const diff = result.getDate() - day + 6
	result.setDate(diff)
	result.setHours(23, 59, 59, 999)
	return result
}
