import type { DateString, TimeSession } from '../types/index.ts'
import { convertToDateString } from '../utils/convertToDateString.ts'
import { formatOperationError } from '../utils/formatOperationError.ts'
import {
	loadSessionsForSelectedDate,
	persistNewSession,
	persistSessionDeletion,
	persistSessionUpdate,
	refreshSessionsAfterMutation,
} from '../utils/sessionMutations.ts'

interface UseSessionManagerReturnType {
	/** Currently selected date for viewing sessions. */
	selectedDate: Ref<DateString>
	/** Array of time sessions for the currently selected date. */
	sessions: Readonly<Ref<TimeSession[]>>
	/** Loading state indicator for async operations. */
	loading: Readonly<Ref<boolean>>
	/** Error message from the last failed operation. */
	errorMessage: Readonly<Ref<string>>
	/** Clears the current error message. */
	clearError(): void
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
	 * Create a completed session with the given start and end times.
	 * @param startTime - Session start
	 * @param endTime - Session end
	 * @returns Promise that resolves when the session is created
	 */
	createSession(startTime: Date, endTime: Date): Promise<void>
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
	const errorMessage = shallowRef<string>('')

	async function loadSessionsForDate(date: DateString): Promise<void> {
		await loadSessionsForSelectedDate(
			date,
			(loadedSessions) => {
				sessions.value = loadedSessions
			},
			(message) => {
				errorMessage.value = message
			},
		)
	}

	async function runMutation(action: string, mutate: () => Promise<void>): Promise<void> {
		try {
			loading.value = true
			errorMessage.value = ''
			await mutate()
			await refreshSessionsAfterMutation({
				selectedDate: selectedDate.value,
				loadSessionsForDate: (date) => loadSessionsForDate(date),
				onSessionsChanged,
			})
		} catch (error) {
			errorMessage.value = formatOperationError(action, error)
		} finally {
			loading.value = false
		}
	}

	async function updateSessionData(
		session: TimeSession,
		updates: Partial<TimeSession>,
	): Promise<void> {
		await runMutation('update session', () => persistSessionUpdate(session, updates))
	}

	async function deleteSessionData(session: TimeSession): Promise<void> {
		await runMutation('delete session', () => persistSessionDeletion(session.id))
	}

	async function createSession(startTime: Date, endTime: Date): Promise<void> {
		await runMutation('add session', () => persistNewSession(startTime, endTime))
	}

	function clearError(): void {
		errorMessage.value = ''
	}

	watch(selectedDate, async (newDate) => {
		await loadSessionsForDate(newDate)
	})

	return {
		selectedDate,
		sessions: shallowReadonly(sessions),
		loading: shallowReadonly(loading),
		errorMessage: shallowReadonly(errorMessage),
		clearError,
		loadSessionsForDate,
		updateSessionData,
		deleteSessionData,
		createSession,
	}
}
