import * as Sentry from '@sentry/nuxt'
import { useDocumentVisibility, useIntervalFn } from '@vueuse/core'
import { onMounted, onUnmounted, type Ref, shallowReadonly, shallowRef, watch } from 'vue'
import type { Milliseconds, TimerState } from '../types/index.ts'
import { convertToDateString } from '../utils/convertToDateString.ts'
import { getActiveSession, saveSession, updateSession } from '../utils/database.ts'
import { diffInMilliseconds } from '../utils/diffInMilliseconds.ts'

interface UseTimerStateReturnType {
	/** Current timer state including running status, active session, and start time. */
	timerState: Readonly<Ref<TimerState>>
	/** Duration of the current active session in milliseconds. */
	currentSessionDuration: Readonly<Ref<Milliseconds>>
	/** Loading state indicator for async operations. */
	loading: Readonly<Ref<boolean>>
	/** Error message from the last failed operation. */
	error: Readonly<Ref<string>>
	/**
	 * Toggle the timer between running and paused states.
	 * Handles starting new sessions or pausing active ones.
	 * @returns Promise that resolves when the operation completes
	 */
	toggleTimer(): Promise<void>
	/**
	 * Load the active session from the database if one exists.
	 * Restores timer state on initialization.
	 * @returns Promise that resolves when loading completes
	 */
	loadActiveSession(): Promise<void>
}

/**
 * Composable for managing timer state and operations.
 *
 * Provides functionality for:
 * - Starting/stopping timer sessions
 * - Tracking current session duration
 * - Handling document visibility changes
 * - Loading and restoring active sessions
 *
 * @returns UseTimerStateReturnType - API for timer state management
 */
export function useTimerState(): UseTimerStateReturnType {
	const timerState = shallowRef<TimerState>({
		isRunning: false,
		currentSession: null,
		startTime: null,
	})

	const currentSessionDuration = shallowRef<Milliseconds>(0 as Milliseconds)
	const loading = shallowRef(false)
	const error = shallowRef<string>('')

	function updateCurrentSessionDuration(): void {
		if (!timerState.value.isRunning || !timerState.value.startTime) return
		currentSessionDuration.value = diffInMilliseconds(timerState.value.startTime, new Date())
	}

	const { pause, resume } = useIntervalFn(() => {
		updateCurrentSessionDuration()
	}, 1000)

	const visibility = useDocumentVisibility()

	watch(
		visibility,
		() => {
			if (visibility.value === 'hidden') {
				pause()
			} else {
				updateCurrentSessionDuration()
				resume()
			}
		},
		{ immediate: true },
	)

	async function loadActiveSession(): Promise<void> {
		try {
			const activeSession = await getActiveSession()
			if (activeSession) {
				timerState.value = {
					isRunning: true,
					currentSession: activeSession,
					startTime: activeSession.startTime,
				}
				updateCurrentSessionDuration()
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

		pause()

		Sentry.logger.info('Timer paused', {
			endTime: endTime.toISOString(),
			duration,
		})
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
		startTimerInterval()
		updateCurrentSessionDuration()
	})

	onUnmounted(() => {
		stopTimerInterval()
	})

	return {
		timerState: shallowReadonly(timerState),
		currentSessionDuration: shallowReadonly(currentSessionDuration),
		loading: shallowReadonly(loading),
		error: shallowReadonly(error),
		toggleTimer,
		loadActiveSession,
	}
}
