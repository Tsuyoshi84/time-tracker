import type { DateString, TimeSession } from '../types/index.ts'
import { convertToDateString } from './convertToDateString.ts'
import {
	checkForOverlappingSessions,
	deleteSession,
	getSessionsByDate,
	saveSession,
	updateSession,
} from './database.ts'
import { diffInMilliseconds } from './diffInMilliseconds.ts'
import { formatOperationError } from './formatOperationError.ts'
import { normalizeSessionUpdates } from './normalizeSessionUpdates.ts'

/**
 * Ensures a new or updated session does not overlap existing sessions.
 * @param startTime - Proposed start time
 * @param endTime - Proposed end time
 * @param excludeId - Session id to exclude when editing
 */
export async function assertNoOverlappingSessions(
	startTime: Date,
	endTime: Date,
	excludeId?: number,
): Promise<void> {
	const overlapping = await checkForOverlappingSessions(startTime, endTime, excludeId)
	if (overlapping.length > 0) {
		throw new Error('This time range overlaps with existing sessions')
	}
}

interface SessionMutationContext {
	selectedDate: DateString
	loadSessionsForDate(date: DateString): Promise<void>
	onSessionsChanged?: () => void | Promise<void>
}

/**
 * Reloads the current day and notifies listeners after a mutation succeeds.
 */
export async function refreshSessionsAfterMutation(context: SessionMutationContext): Promise<void> {
	await context.loadSessionsForDate(context.selectedDate)
	if (context.onSessionsChanged) {
		await context.onSessionsChanged()
	}
}

/**
 * Persists session updates after overlap validation.
 */
export async function persistSessionUpdate(
	session: TimeSession,
	updates: Partial<TimeSession>,
): Promise<void> {
	const startTime = updates.startTime ?? session.startTime
	const endTime = updates.endTime ?? session.endTime
	const hasTimeUpdate = 'startTime' in updates || 'endTime' in updates
	const shouldValidateOverlap = hasTimeUpdate && Boolean(endTime)

	if (shouldValidateOverlap && endTime) {
		await assertNoOverlappingSessions(startTime, endTime, session.id)
	}

	await updateSession(session.id, normalizeSessionUpdates(session, updates))
}

/**
 * Creates a completed session after overlap validation.
 */
export async function persistNewSession(startTime: Date, endTime: Date): Promise<void> {
	await assertNoOverlappingSessions(startTime, endTime)

	const now = new Date()
	await saveSession({
		startTime,
		endTime,
		date: convertToDateString(startTime),
		isActive: false,
		duration: diffInMilliseconds(startTime, endTime),
		createdAt: now,
		updatedAt: now,
	})
}

/**
 * Deletes a session by id.
 */
export async function persistSessionDeletion(sessionId: number): Promise<void> {
	await deleteSession(sessionId)
}

/**
 * Loads sessions for a date, surfacing load failures as error messages.
 */
export async function loadSessionsForSelectedDate(
	date: DateString,
	setSessions: (sessions: TimeSession[]) => void,
	setErrorMessage: (message: string) => void,
): Promise<void> {
	try {
		setSessions(await getSessionsByDate(date))
	} catch (error) {
		setErrorMessage(formatOperationError('load sessions', error))
	}
}
