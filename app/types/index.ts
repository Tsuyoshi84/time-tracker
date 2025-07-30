import type { Temporal } from '@js-temporal/polyfill'
/** The date string format. (YYYY-MM-DD) */
export type DateString = `${number}-${number}-${number}`

export type Milliseconds = number & { __brand: 'Milliseconds' }

export interface TimeSession {
	id: number
	startTime: Temporal.PlainDateTime
	endTime?: Temporal.PlainDateTime
	duration?: Milliseconds
	date: DateString
	isActive: boolean
	createdAt: Temporal.PlainDateTime
	updatedAt: Temporal.PlainDateTime
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
	startTime: Temporal.PlainDateTime | null
}

export interface TimeInput {
	hours: number
	minutes: number
}

export interface SessionEdit {
	id: number
	startTime: Temporal.PlainDateTime
	endTime: Temporal.PlainDateTime
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
