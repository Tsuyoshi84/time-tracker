import type { IDBPDatabase } from 'idb'
import { openDB } from 'idb'
import type { TimeSession } from '../types'

const DB_NAME = 'timeTracker'
const DB_VERSION = 1
const SESSION_STORE = 'sessions'

let db: IDBPDatabase | null = null

export async function initDatabase(): Promise<IDBPDatabase> {
	if (db) return db

	db = await openDB(DB_NAME, DB_VERSION, {
		upgrade(database) {
			if (!database.objectStoreNames.contains(SESSION_STORE)) {
				const sessionStore = database.createObjectStore(SESSION_STORE, {
					keyPath: 'id',
					autoIncrement: true,
				})

				// Index by date for efficient date-based queries
				sessionStore.createIndex('date', 'date', { unique: false })

				// Index by start time for chronological ordering
				sessionStore.createIndex('startTime', 'startTime', { unique: false })

				// Index by active status for finding active sessions
				sessionStore.createIndex('isActive', 'isActive', { unique: false })
			}
		},
	})

	return db
}

export async function saveSession(session: Omit<TimeSession, 'id'>): Promise<TimeSession> {
	const database = await initDatabase()
	const tx = database.transaction(SESSION_STORE, 'readwrite')
	const store = tx.objectStore(SESSION_STORE)

	const sessionWithTimestamps = {
		...session,
		createdAt: new Date(),
		updatedAt: new Date(),
		startTime: new Date(session.startTime),
		endTime: session.endTime ? new Date(session.endTime) : undefined,
	}

	const id = await store.add(sessionWithTimestamps)
	await tx.done

	return { ...sessionWithTimestamps, id: Number(id) }
}

export async function updateSession(id: number, updates: Partial<TimeSession>): Promise<void> {
	const database = await initDatabase()
	const tx = database.transaction(SESSION_STORE, 'readwrite')
	const store = tx.objectStore(SESSION_STORE)

	const existingSession = await store.get(id)
	if (!existingSession) {
		throw new Error(`Session with id ${id} not found`)
	}

	const updatedSession = {
		...existingSession,
		...updates,
		updatedAt: new Date(),
		startTime: updates.startTime ? new Date(updates.startTime) : existingSession.startTime,
		endTime: updates.endTime ? new Date(updates.endTime) : existingSession.endTime,
	}

	await store.put(updatedSession)
	await tx.done
}

export async function deleteSession(id: number): Promise<void> {
	const database = await initDatabase()
	const tx = database.transaction(SESSION_STORE, 'readwrite')
	const store = tx.objectStore(SESSION_STORE)

	await store.delete(id)
	await tx.done
}

export async function getSessionsByDate(date: string): Promise<TimeSession[]> {
	if (!date) return []
	const database = await initDatabase()
	const tx = database.transaction(SESSION_STORE, 'readonly')
	const store = tx.objectStore(SESSION_STORE)
	const index = store.index('date')

	const sessions = await index.getAll(date)
	await tx.done

	// Convert stored dates back to Date objects
	return sessions
		.map((session) => ({
			...session,
			startTime: new Date(session.startTime),
			endTime: session.endTime ? new Date(session.endTime) : undefined,
			createdAt: new Date(session.createdAt),
			updatedAt: new Date(session.updatedAt),
		}))
		.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
}

export async function getActiveSession(): Promise<TimeSession | null> {
	const database = await initDatabase()
	const tx = database.transaction(SESSION_STORE, 'readonly')
	const store = tx.objectStore(SESSION_STORE)
	const index = store.index('isActive')

	// Use IDBKeyRange.only(true) to get all active sessions
	const activeSessions = await index.getAll(IDBKeyRange.only(true))
	await tx.done

	if (!activeSessions || activeSessions.length === 0) return null
	const activeSession = activeSessions[0]

	return {
		...activeSession,
		startTime: new Date(activeSession.startTime),
		endTime: activeSession.endTime ? new Date(activeSession.endTime) : undefined,
		createdAt: new Date(activeSession.createdAt),
		updatedAt: new Date(activeSession.updatedAt),
	}
}

export async function getSessionsInDateRange(
	startDate: string,
	endDate: string,
): Promise<TimeSession[]> {
	const database = await initDatabase()
	const tx = database.transaction(SESSION_STORE, 'readonly')
	const store = tx.objectStore(SESSION_STORE)
	const index = store.index('date')

	const range = IDBKeyRange.bound(startDate, endDate)
	const sessions = await index.getAll(range)
	await tx.done

	return sessions
		.map((session) => ({
			...session,
			startTime: new Date(session.startTime),
			endTime: session.endTime ? new Date(session.endTime) : undefined,
			createdAt: new Date(session.createdAt),
			updatedAt: new Date(session.updatedAt),
		}))
		.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
}

export async function calculateDayStats(
	date: string,
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

export async function clearAllData(): Promise<void> {
	const database = await initDatabase()
	const tx = database.transaction(SESSION_STORE, 'readwrite')
	const store = tx.objectStore(SESSION_STORE)

	await store.clear()
	await tx.done
}

export async function checkForOverlappingSessions(
	startTime: Date,
	endTime: Date,
	excludeId?: number,
): Promise<TimeSession[]> {
	const date = startTime.toISOString().split('T')[0]
	const sessions = await getSessionsByDate(date ?? '')

	return sessions.filter((session) => {
		// Exclude the session being edited
		if (excludeId && session.id === excludeId) return false

		// Only check completed sessions
		if (!session.endTime) return false

		// Check for overlap
		const sessionStart = session.startTime.getTime()
		const sessionEnd = session.endTime.getTime()
		const newStart = startTime.getTime()
		const newEnd = endTime.getTime()

		return newStart < sessionEnd && newEnd > sessionStart
	})
}
