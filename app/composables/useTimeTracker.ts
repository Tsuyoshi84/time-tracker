import { Temporal } from '@js-temporal/polyfill'
import { useDocumentVisibility, useIntervalFn } from '@vueuse/core'
import { computed, onMounted, onUnmounted, shallowReadonly, shallowRef, watch } from 'vue'
import type { DateString, DayStats, Milliseconds, TimerState, TimeSession } from '../types/index.ts'
import { convertToDateString } from '../utils/convertToDateString.ts'
import {
	checkForOverlappingSessions,
	deleteSession,
	getActiveSession,
	getSessionsByDate,
	getSessionsInDateRange,
	initDatabase,
	saveSession,
	updateSession,
} from '../utils/database.ts'

export function useTimeTracker() {
	/** The duration of the current session in milliseconds. */
	const currentSessionDuration = shallowRef<Milliseconds>(0 as Milliseconds)

	const { pause, resume } = useIntervalFn(() => {
		updateCurrentSessionDuration()
	}, 1000)

	const visibility = useDocumentVisibility()

	watch(visibility, () => {
		if (visibility.value === 'hidden') {
			pause()
		} else {
			updateCurrentSessionDuration()
			resume()
		}
	})

	const timerState = shallowRef<TimerState>({
		isRunning: false,
		currentSession: null,
		startTime: null,
	})

	function updateCurrentSessionDuration(): void {
		if (!timerState.value.isRunning || !timerState.value.startTime) return
		const now = Temporal.Now.plainDateTimeISO()
		currentSessionDuration.value = diffInMilliseconds(timerState.value.startTime, now)
	}

	const sessions = shallowRef<TimeSession[]>([])
	const todaysTotalDuration = computed<Milliseconds>(() => {
		const today = convertToDateString(Temporal.Now.plainDateISO())
		const todaySessions = sessions.value.filter((s) => s.date === today && s.endTime)
		return (currentSessionDuration.value +
			todaySessions.reduce(
				(total, session) =>
					session.endTime ? total + diffInMilliseconds(session.startTime, session.endTime) : total,
				0,
			)) as Milliseconds
	})

	const sessionCount = computed(() => {
		const today = convertToDateString(Temporal.Now.plainDateISO())
		return sessions.value.filter((s) => s.date === today).length
	})

	const selectedDate = shallowRef<DateString>(convertToDateString(Temporal.Now.plainDateISO()))
	const loading = shallowRef(false)
	const error = shallowRef<string>('')

	async function initializeTimer(): Promise<void> {
		try {
			loading.value = true
			initDatabase()
			await loadActiveSession()
			await loadSessionsForDate(selectedDate.value)
			await loadWeeklyStats()
			startTimerInterval()
			updateCurrentSessionDuration()
		} catch (err) {
			error.value = `Failed to initialize: ${err instanceof Error ? err.message : 'Unknown error'}`
		} finally {
			loading.value = false
		}
	}

	async function loadActiveSession(): Promise<void> {
		try {
			const activeSession = await getActiveSession()
			if (activeSession) {
				timerState.value = {
					isRunning: true,
					currentSession: activeSession,
					startTime: activeSession.startTime,
				}
			} else {
				pause()
			}
		} catch (err) {
			error.value = `Failed to load active session: ${
				err instanceof Error ? err.message : 'Unknown error'
			}`
		}
	}

	async function toggleTimer(): Promise<void> {
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

	async function startTimer(): Promise<void> {
		const now = Temporal.Now.plainDateTimeISO()
		const todayPlainDate = now.toPlainDate()
		const sessionData = {
			startTime: now,
			date: convertToDateString(todayPlainDate),
			isActive: true,
			duration: 0 as Milliseconds,
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
		resume()
	}

	async function pauseTimer(): Promise<void> {
		if (!timerState.value.currentSession) return

		const endTime = Temporal.Now.plainDateTimeISO()
		const duration = diffInMilliseconds(timerState.value.currentSession.startTime, endTime)

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
		currentSessionDuration.value = 0 as Milliseconds

		await refreshCurrentDateSessions()
		pause()
	}

	async function loadSessionsForDate(date: DateString): Promise<void> {
		try {
			const dateSessions = await getSessionsByDate(date)
			sessions.value = dateSessions
		} catch (err) {
			error.value = `Failed to load sessions: ${err instanceof Error ? err.message : 'Unknown error'}`
		}
	}

	async function refreshCurrentDateSessions(): Promise<void> {
		await loadSessionsForDate(selectedDate.value)
	}

	async function updateSessionData(
		session: TimeSession,
		updates: Partial<TimeSession>,
	): Promise<void> {
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

	async function deleteSessionData(session: TimeSession): Promise<void> {
		try {
			loading.value = true
			error.value = ''

			await deleteSession(session.id)
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

	async function addManualSession(): Promise<void> {
		const now = Temporal.Now.plainDateTimeISO()
		const startTime = now.subtract({ hours: 1 })
		const endTime = now
		const sessionData = {
			startTime,
			endTime,
			date: convertToDateString(now.toPlainDate()),
			isActive: false,
			duration: diffInMilliseconds(startTime, endTime),
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

	// These should be Temporal.PlainDate
	const weekStart = shallowRef<Temporal.PlainDate>(Temporal.Now.plainDateISO())
	const weekEnd = shallowRef<Temporal.PlainDate>(Temporal.Now.plainDateISO())
	const dailyStats = shallowRef<DayStats[]>([])

	async function loadWeeklyStats(): Promise<void> {
		try {
			const weekStartStr = convertToDateString(weekStart.value)
			const weekEndStr = convertToDateString(weekEnd.value)

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
			let currentDate = weekStart.value

			for (let i = 0; i < 7; i++) {
				const dateStr = convertToDateString(currentDate)
				const daySessions = sessionsByDate.get(dateStr) || []

				const completedSessions = daySessions.filter((s) => s.endTime)
				const totalDuration = completedSessions.reduce((total, session) => {
					if (session.endTime) {
						return total + session.endTime.since(session.startTime).total({ unit: 'millisecond' })
					}
					return total
				}, 0)

				stats.push({
					date: dateStr,
					totalDuration,
					sessionCount: daySessions.length,
					sessions: daySessions,
				})

				currentDate = currentDate.add({ days: 1 })
			}

			dailyStats.value = stats
		} catch (err) {
			error.value = `Failed to load weekly stats: ${
				err instanceof Error ? err.message : 'Unknown error'
			}`
		}
	}

	async function selectDate(date: DateString): Promise<void> {
		selectedDate.value = date
		await loadSessionsForDate(date)
	}

	async function navigateWeek(direction: 'prev' | 'next'): Promise<void> {
		const days = direction === 'prev' ? -7 : 7
		weekStart.value = weekStart.value.add({ days })
		weekEnd.value = weekEnd.value.add({ days })
		await loadWeeklyStats()
	}

	let timerInterval: number | null = null

	function startTimerInterval(): void {
		if (timerInterval) clearInterval(timerInterval)
		timerInterval = window.setInterval(() => {
			// Force reactivity update for real-time timer display
			if (timerState.value.isRunning) {
				// biome-ignore lint/correctness/noSelfAssign: This triggers reactivity
				timerState.value.startTime = timerState.value.startTime
			}
		}, 1000)
	}

	function stopTimerInterval(): void {
		if (timerInterval) {
			clearInterval(timerInterval)
			timerInterval = null
		}
	}

	onMounted(() => {
		initializeTimer()
	})

	onUnmounted(() => {
		stopTimerInterval()
	})

	return {
		// State
		timerState: shallowReadonly(timerState),
		sessions: shallowReadonly(sessions),
		selectedDate: shallowReadonly(selectedDate),
		weekStart: shallowReadonly(weekStart),
		weekEnd: shallowReadonly(weekEnd),
		dailyStats: shallowReadonly(dailyStats),
		loading: shallowReadonly(loading),
		error: shallowReadonly(error),

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
function getStartOfWeek(date: Temporal.PlainDate): Temporal.PlainDate {
	// ISO weekday: Monday = 1, Sunday = 7
	const dayOfWeek = date.dayOfWeek ?? date.day % 7
	return date.subtract({ days: dayOfWeek - 1 })
}

function getEndOfWeek(date: Temporal.PlainDate): Temporal.PlainDate {
	// ISO weekday: Monday = 1, Sunday = 7
	const dayOfWeek = date.dayOfWeek ?? date.day % 7
	return date.add({ days: 7 - dayOfWeek })
}

function diffInMilliseconds(
	start: Temporal.PlainDateTime,
	end: Temporal.PlainDateTime,
): Milliseconds {
	return end.since(start).total({ unit: 'millisecond' }) as Milliseconds
}
