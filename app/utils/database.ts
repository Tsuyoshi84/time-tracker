import type { Table } from 'dexie'
import Dexie from 'dexie'
import type { DateString, TimeSession } from '../types/index.ts'

const DB_NAME = 'timeTracker'
const DB_VERSION = 1

/**
 * Interface for the session table schema.
 */
interface SessionTable extends Omit<TimeSession, 'id' | 'isActive'> {
	id?: number
	isActive?: number // Store as 1 (true) or 0 (false) for index compatibility
}

/**
 * Dexie database class for time tracker sessions.
 */
class TimeTrackerDexie extends Dexie {
	sessions!: Table<SessionTable, number>

	constructor() {
		super(DB_NAME)
		this.version(DB_VERSION).stores({
			sessions: '++id,date,startTime,isActive',
		})
	}
}

const db = new TimeTrackerDexie()

/**
 * Initializes the Dexie database instance.
 * @return Dexie database instance
 */
export function initDatabase(): Dexie {
	return db
}

/**
 * Saves a new session to the database.
 * @param session Session data without id
 * @return The saved session with id
 */
export async function saveSession(session: Omit<TimeSession, 'id'>): Promise<TimeSession> {
	const now = new Date()
	const sessionWithTimestamps: SessionTable = {
		...session,
		isActive: session.isActive ? 1 : 0,
		createdAt: now,
		updatedAt: now,
		startTime: new Date(session.startTime),
		endTime: session.endTime ? new Date(session.endTime) : undefined,
	}
	const id = await db.sessions.add(sessionWithTimestamps)
	return {
		...sessionWithTimestamps,
		id: Number(id),
		isActive: !!sessionWithTimestamps.isActive,
	} as TimeSession
}

/**
 * Updates an existing session by id.
 * @param id Session id
 * @param updates Partial session data
 */
export async function updateSession(id: number, updates: Partial<TimeSession>): Promise<void> {
	const existingSession = await db.sessions.get(id)
	if (!existingSession) {
		throw new Error(`Session with id ${id} not found`)
	}
	const updatedSession: SessionTable = {
		...existingSession,
		...updates,
		isActive:
			updates.isActive !== undefined ? (updates.isActive ? 1 : 0) : existingSession.isActive,
		updatedAt: new Date(),
		startTime: updates.startTime ? new Date(updates.startTime) : existingSession.startTime,
		endTime: updates.endTime ? new Date(updates.endTime) : existingSession.endTime,
	}
	await db.sessions.put({ ...updatedSession, id })
}

/**
 * Deletes a session by id.
 * @param id Session id
 */
export async function deleteSession(id: number): Promise<void> {
	await db.sessions.delete(id)
}

/**
 * Gets all sessions for a specific date.
 * @param date Date string (YYYY-MM-DD)
 * @return Array of sessions for the date
 */
export async function getSessionsByDate(date: DateString): Promise<TimeSession[]> {
	if (!date) return []
	const sessions = await db.sessions.where('date').equals(date).toArray()
	return sessions
		.map((session) => ({
			...session,
			id: session.id as number,
			isActive: !!session.isActive,
			startTime: new Date(session.startTime),
			endTime: session.endTime ? new Date(session.endTime) : undefined,
			createdAt: new Date(session.createdAt),
			updatedAt: new Date(session.updatedAt),
		}))
		.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
}

/**
 * Gets the currently active session, if any.
 * @return The active session or null
 */
export async function getActiveSession(): Promise<TimeSession | null> {
	const activeSessions = await db.sessions.where('isActive').equals(1).toArray()
	if (!activeSessions || activeSessions.length === 0) return null
	const activeSession = activeSessions[0]
	if (!activeSession || typeof activeSession.date !== 'string') return null
	return {
		...activeSession,
		id: activeSession.id as number,
		date: activeSession.date,
		isActive: !!activeSession.isActive,
		startTime: new Date(activeSession.startTime),
		endTime: activeSession.endTime ? new Date(activeSession.endTime) : undefined,
		createdAt: new Date(activeSession.createdAt),
		updatedAt: new Date(activeSession.updatedAt),
	}
}

/**
 * Gets all sessions in a date range.
 * @param startDate Start date string (YYYY-MM-DD)
 * @param endDate End date string (YYYY-MM-DD)
 * @return Array of sessions in the range
 */
export async function getSessionsInDateRange(
	startDate: string,
	endDate: string,
): Promise<TimeSession[]> {
	const sessions = await db.sessions.where('date').between(startDate, endDate, true, true).toArray()
	return sessions
		.map((session) => ({
			...session,
			id: session.id as number,
			isActive: !!session.isActive,
			startTime: new Date(session.startTime),
			endTime: session.endTime ? new Date(session.endTime) : undefined,
			createdAt: new Date(session.createdAt),
			updatedAt: new Date(session.updatedAt),
		}))
		.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
}

/**
 * Calculates total duration and session count for a day.
 * @param date Date string (YYYY-MM-DD)
 * @return Object with totalDuration and sessionCount
 */
export async function calculateDayStats(
	date: DateString,
): Promise<{ totalDuration: number; sessionCount: number }> {
	const sessions = await getSessionsByDate(date ?? '')
	const completedSessions = sessions.filter((session) => session.endTime)
	const totalDuration = completedSessions.reduce((total, session) => {
		if (session.endTime) {
			return total + (session.endTime.getTime() - session.startTime.getTime())
		}
		return total
	}, 0)
	return {
		totalDuration,
		sessionCount: sessions.length,
	}
}

/**
 * Clears all session data from the database.
 */
export async function clearAllData(): Promise<void> {
	await db.sessions.clear()
}

/**
 * Checks for overlapping sessions in a day, excluding a given session id.
 * @param startTime Start time of the new/edited session
 * @param endTime End time of the new/edited session
 * @param excludeId Optional session id to exclude
 * @return Array of overlapping sessions
 */
export async function checkForOverlappingSessions(
	startTime: Date,
	endTime: Date,
	excludeId?: number,
): Promise<TimeSession[]> {
	const date = startTime.toISOString().split('T')[0] as DateString
	const sessions = await getSessionsByDate(date)
	return sessions.filter((session) => {
		if (excludeId && session.id === excludeId) return false
		if (!session.endTime) return false
		const sessionStart = session.startTime.getTime()
		const sessionEnd = session.endTime.getTime()
		const newStart = startTime.getTime()
		const newEnd = endTime.getTime()
		return newStart < sessionEnd && newEnd > sessionStart
	})
}
