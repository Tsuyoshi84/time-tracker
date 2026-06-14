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
	totalDuration: Milliseconds // in milliseconds
	/** Number of sessions for this day. */
	sessionCount: number
	/** Array of all sessions for this day. */
	sessions: TimeSession[]
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

/** Statistics for a single month's time tracking. */
export interface MonthStats {
	/** The month label (e.g., 'January 2024'). */
	monthLabel: string
	/** The start date of the month in YYYY-MM-DD format. */
	startDate: DateString
	/** The end date of the month in YYYY-MM-DD format. */
	endDate: DateString
	/** Total duration tracked for this month in milliseconds. */
	totalDuration: Milliseconds
	/** Number of sessions for this month. */
	sessionCount: number
}
