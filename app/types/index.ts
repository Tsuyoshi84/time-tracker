/** The date string format. (YYYY-MM-DD) */
export type DateString = `${number}-${number}-${number}`

export type Milliseconds = number & { __brand: 'Milliseconds' }

export interface TimeSession {
	id: number
	startTime: Date
	endTime?: Date
	duration?: Milliseconds
	date: DateString
	isActive: boolean
	createdAt: Date
	updatedAt: Date
}

export interface DayStats {
	date: DateString
	totalDuration: number // in milliseconds
	sessionCount: number
	sessions: TimeSession[]
}

export interface WeekStats {
	weekStart: DateString
	weekEnd: DateString
	totalDuration: number // in milliseconds
	dailyStats: DayStats[]
}

export interface TimerState {
	isRunning: boolean
	currentSession: TimeSession | null
	startTime: Date | null
}

export interface TimeInput {
	hours: number
	minutes: number
}

export interface SessionEdit {
	id: number
	startTime: Date
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
