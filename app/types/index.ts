/** The date string format. (YYYY-MM-DD) */
export type DateString = `${number}-${number}-${number}`

/** A branded type representing milliseconds for type safety. */
export type Milliseconds = number & { __brand: 'Milliseconds' }

/** Represents a time tracking session. */
export interface TimeSession {
	/** Unique identifier for the session. */
	id: number
	/** The start time of the session. */
	startTime: Date
	/** The end time of the session (optional for active sessions). */
	endTime?: Date
	/** The duration of the session in milliseconds (optional for active sessions). */
	duration?: Milliseconds
	/** The date of the session in YYYY-MM-DD format. */
	date: DateString
	/** Whether the session is currently active. */
	isActive: boolean
	/** The timestamp when the session was created. */
	createdAt: Date
	/** The timestamp when the session was last updated. */
	updatedAt: Date
}

/** Statistics for a single day's time tracking. */
export interface DayStats {
	/** The date in YYYY-MM-DD format. */
	date: DateString
	/** Total duration tracked for this day in milliseconds. */
	totalDuration: number // in milliseconds
	/** Number of sessions for this day. */
	sessionCount: number
	/** Array of all sessions for this day. */
	sessions: TimeSession[]
}

/** Statistics for a week's time tracking. */
export interface WeekStats {
	/** The start date of the week in YYYY-MM-DD format. */
	weekStart: DateString
	/** The end date of the week in YYYY-MM-DD format. */
	weekEnd: DateString
	/** Total duration tracked for the week in milliseconds. */
	totalDuration: number // in milliseconds
	/** Array of daily statistics for each day in the week. */
	dailyStats: DayStats[]
}

/** Represents the current state of the timer. */
export interface TimerState {
	/** Whether the timer is currently running. */
	isRunning: boolean
	/** The current active session, if any. */
	currentSession: TimeSession | null
	/** The start time of the current session, if any. */
	startTime: Date | null
}

/** Represents time input for manual session creation. */
export interface TimeInput {
	/** Number of hours. */
	hours: number
	/** Number of minutes. */
	minutes: number
}

/** Represents data for editing an existing session. */
export interface SessionEdit {
	/** The unique identifier of the session to edit. */
	id: number
	/** The new start time for the session. */
	startTime: Date
	/** The new end time for the session. */
	endTime: Date
}

/**
 * Represents a single day's summary in the week view.
 */
export interface WeekDay {
	/** The date in YYYY-MM-DD format. */
	date: DateString
	/** The short name of the day (e.g., 'Mon', 'Tue'). */
	dayName: string
	/** Whether this day is today. */
	isToday: boolean
	/** Total duration tracked for this day, in seconds. */
	totalDuration: number
	/** Number of sessions for this day. */
	sessionCount: number
}

// Runtime configuration types
declare module 'nuxt/schema' {
	interface PublicRuntimeConfig {
		sentry: {
			dsn: string
			release?: string
		}
	}
}
