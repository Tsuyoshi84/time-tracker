import { type Ref, shallowReadonly, shallowRef } from 'vue'
import type { DateString, TimeSession } from '../types/index.ts'
import { convertToDateString } from '../utils/convertToDateString.ts'
import {
	checkForOverlappingSessions,
	deleteSession,
	getSessionsByDate,
	saveSession,
	updateSession,
} from '../utils/database.ts'
import { diffInMilliseconds } from '../utils/diffInMilliseconds.ts'

interface UseSessionManagerReturnType {
	/** Array of time sessions for the currently selected date. */
	sessions: Readonly<Ref<TimeSession[]>>
	/** Currently selected date for viewing sessions. */
	selectedDate: Readonly<Ref<DateString>>
	/** Loading state indicator for async operations. */
	loading: Readonly<Ref<boolean>>
	/** Error message from the last failed operation. */
	error: Readonly<Ref<string>>
	/**
	 * Load sessions for a specific date.
	 * @param date - DateString in YYYY-MM-DD format
	 * @returns Promise that resolves when sessions are loaded
	 */
	loadSessionsForDate(date: DateString): Promise<void>
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
}

/**
 * Composable for managing time tracking sessions.
 *
 * Provides functionality for:
 * - Loading sessions by date
 * - Creating, updating, and deleting sessions
 * - Managing selected date
 * - Validating session overlaps
 *
 * @param onSessionsChanged - Callback function called when sessions are modified
 * @returns UseSessionManagerReturnType - API for session management
 */
export function useSessionManager(
	onSessionsChanged?: () => void | Promise<void>,
): UseSessionManagerReturnType {
	const sessions = shallowRef<TimeSession[]>([])
	const selectedDate = shallowRef<DateString>(convertToDateString(new Date()))
	const loading = shallowRef(false)
	const error = shallowRef<string>('')

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

			// Notify parent that sessions changed
			if (onSessionsChanged) {
				await onSessionsChanged()
			}
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

			// Notify parent that sessions changed
			if (onSessionsChanged) {
				await onSessionsChanged()
			}
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

			// Notify parent that sessions changed
			if (onSessionsChanged) {
				await onSessionsChanged()
			}
		} catch (err) {
			error.value = `Failed to add session: ${err instanceof Error ? err.message : 'Unknown error'}`
		} finally {
			loading.value = false
		}
	}

	async function selectDate(date: DateString): Promise<void> {
		selectedDate.value = date
		await loadSessionsForDate(date)
	}

	return {
		sessions: shallowReadonly(sessions),
		selectedDate: shallowReadonly(selectedDate),
		loading: shallowReadonly(loading),
		error: shallowReadonly(error),
		loadSessionsForDate,
		updateSessionData,
		deleteSessionData,
		addManualSession,
		selectDate,
	}
}
