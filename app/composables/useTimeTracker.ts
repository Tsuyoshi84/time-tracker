import * as Sentry from '@sentry/nuxt'
import { useDocumentVisibility, useIntervalFn } from '@vueuse/core'
import { computed, onMounted, onUnmounted, type Ref, shallowReadonly, shallowRef, watch } from 'vue'
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

interface UseTimeTrackerReturnType {
	/** Current timer state including running status, active session, and start time.  */
	timerState: Readonly<Ref<TimerState>>
	/** Array of time sessions for the currently selected date.  */
	sessions: Readonly<Ref<TimeSession[]>>
	/** Currently selected date for viewing sessions. */
	selectedDate: Readonly<Ref<DateString>>
	/** Start date of the current week being viewed.  */
	weekStart: Readonly<Ref<Date>>
	/** End date of the current week being viewed.  */
	weekEnd: Readonly<Ref<Date>>
	/** Daily statistics for the current week.  */
	dailyStats: Readonly<Ref<DayStats[]>>
	/** Loading state indicator for async operations.  */
	loading: Readonly<Ref<boolean>>
	/** Error message from the last failed operation.  */
	error: Readonly<Ref<string>>
	/** Duration of the current active session in milliseconds.  */
	currentSessionDuration: Readonly<Ref<Milliseconds>>
	/** Total duration of all sessions for today in milliseconds.  */
	todaysTotalDuration: Readonly<Ref<Milliseconds>>
	/** Number of sessions for today.  */
	sessionCount: Readonly<Ref<number>>
	/**
	 * Toggle the timer between running and paused states.
	 * Handles starting new sessions or pausing active ones.
	 * @returns Promise that resolves when the operation completes
	 */
	toggleTimer(): Promise<void>
	/**
	 * Update an existing session with new data.
	 * Validates for overlapping sessions and updates the database.
	 * @param session - The session to update
	 * @param updates - Partial session data to apply
	 * @returns Promise that resolves when the update completes
	 */
	updateSessionData(session: TimeSession, updates: Partial<TimeSession>): Promise<void>
	/**
	 * Delete a session from the database.
	 * Removes the session and refreshes the current view.
	 * @param session - The session to delete
	 * @returns Promise that resolves when the deletion completes
	 */
	deleteSessionData(session: TimeSession): Promise<void>
	/**
	 * Add a manual session with default 1-hour duration.
	 * Creates a completed session for the current time period.
	 * @returns Promise that resolves when the session is added
	 */
	addManualSession(): Promise<void>
	/**
	 * Select a specific date to view its sessions.
	 * Loads sessions for the selected date and updates the view.
	 * @param date - DateString in YYYY-MM-DD format
	 * @returns Promise that resolves when the date is loaded
	 */
	selectDate(date: DateString): Promise<void>

	/**
	 * Navigation methods for weekly view.
	 * Provides previous and next week navigation functionality.
	 */
	navigateWeek: {
		/**
		 * Navigate to the previous week.
		 * Updates weekStart, weekEnd, and loads new statistics.
		 *
		 * @async
		 * @returns Promise that resolves when navigation completes
		 */
		prev(): Promise<void>

		/**
		 * Navigate to the next week.
		 * Updates weekStart, weekEnd, and loads new statistics.
		 *
		 * @async
		 * @returns Promise that resolves when navigation completes
		 */
		next(): Promise<void>
	}
}

/**
 * Composable for managing time tracking functionality.
 *
 * Provides state management and methods for:
 * - Starting/stopping timer sessions
 * - Managing session data (CRUD operations)
 * - Loading and displaying daily/weekly statistics
 * - Handling timer state persistence and recovery
 *
 * @returns UseTimeTrackerReturnType - Complete API for time tracking functionality
 */
export function useTimeTracker(): UseTimeTrackerReturnType {
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
		currentSessionDuration.value = diffInMilliseconds(timerState.value.startTime, new Date())
	}

	const sessions = shallowRef<TimeSession[]>([])

	const todaysTotalDuration = computed<Milliseconds>(() => {
		const today = convertToDateString(new Date())
		const todaySessions = sessions.value.filter((s) => s.date === today && s.endTime)
		return (currentSessionDuration.value +
			todaySessions.reduce(
				(total, session) =>
					session.endTime ? total + diffInMilliseconds(session.startTime, session.endTime) : total,
				0,
			)) as Milliseconds
	})

	const sessionCount = computed(() => {
		const today = convertToDateString(new Date())
		return sessions.value.filter((s) => s.date === today).length
	})

	const selectedDate = shallowRef<DateString>(convertToDateString(new Date()))
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
		const now = new Date()
		const sessionData = {
			startTime: now,
			date: convertToDateString(now),
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

		await loadSessionsForDate(selectedDate.value)
		resume()

		Sentry.logger.info('Timer started', { startTime: now.toISOString() })
	}

	async function pauseTimer(): Promise<void> {
		if (!timerState.value.currentSession) return

		const endTime = new Date()
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

		await loadSessionsForDate(selectedDate.value)
		await loadWeeklyStats()
		pause()

		Sentry.logger.info('Timer paused', {
			endTime: endTime.toISOString(),
			duration,
		})
	}

	async function loadSessionsForDate(date: DateString): Promise<void> {
		try {
			sessions.value = await getSessionsByDate(date)
		} catch (err) {
			error.value = `Failed to load sessions: ${err instanceof Error ? err.message : 'Unknown error'}`
		}
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
			await loadSessionsForDate(selectedDate.value)
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
			await loadSessionsForDate(selectedDate.value)
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
		const now = new Date()
		const startTime = new Date(now.getTime() - 60 * 60 * 1000) // 1 hour ago
		const endTime = now

		const sessionData = {
			startTime,
			endTime,
			date: convertToDateString(startTime),
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
			await loadSessionsForDate(selectedDate.value)
			await loadWeeklyStats()
		} catch (err) {
			error.value = `Failed to add session: ${err instanceof Error ? err.message : 'Unknown error'}`
		} finally {
			loading.value = false
		}
	}

	const weekStart = shallowRef<Date>(getStartOfWeek(new Date()))
	const weekEnd = shallowRef<Date>(getEndOfWeek(new Date()))
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
			const currentDate = new Date(weekStart.value)

			for (let i = 0; i < 7; i++) {
				const dateStr = convertToDateString(currentDate)
				const daySessions = sessionsByDate.get(dateStr) || []

				const completedSessions = daySessions.filter((s) => s.endTime)
				const totalDuration = completedSessions.reduce<Milliseconds>((total, session) => {
					if (session.endTime) {
						return (total +
							(session.endTime.getTime() - session.startTime.getTime())) as Milliseconds
					}
					return total
				}, 0 as Milliseconds)

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

	async function selectDate(date: DateString): Promise<void> {
		selectedDate.value = date
		await loadSessionsForDate(date)
	}

	async function navigateWeek(direction: 'prev' | 'next'): Promise<void> {
		const days = direction === 'prev' ? -7 : 7
		weekStart.value = new Date(weekStart.value.getTime() + days * 24 * 60 * 60 * 1000)
		weekEnd.value = new Date(weekEnd.value.getTime() + days * 24 * 60 * 60 * 1000)
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

function diffInMilliseconds(start: Date, end: Date): Milliseconds {
	return (end.getTime() - start.getTime()) as Milliseconds
}
