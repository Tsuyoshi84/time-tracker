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

export interface ValidationError {
	field: string
	message: string
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

export function formatDuration(milliseconds: number): string {
	if (milliseconds <= 0) return '0:00:00'

	const totalSeconds = Math.floor(milliseconds / 1000)
	const hours = Math.floor(totalSeconds / 3600)
	const minutes = Math.floor((totalSeconds % 3600) / 60)
	const seconds = totalSeconds % 60

	function pad(num: number): string {
		return num < 10 ? `0${num}` : `${num}`
	}

	return `${hours}:${pad(minutes)}:${pad(seconds)}`
}

export function formatTime(date: Date): string {
	return date.toLocaleTimeString('en-US', {
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
	})
}

export function formatDate(date: Date): DateString {
	return date.toISOString().split('T')[0] as DateString
}

export function parseTimeInput(timeString: string): Date | null {
	const match = timeString.match(/^(\d{1,2}):(\d{2})$/)
	if (!match) return null

	const hours = Number.parseInt(match[1] as string, 10)
	const minutes = Number.parseInt(match[2] as string, 10)

	if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null

	const today = new Date()
	const result = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes)
	return result
}

export function calculateDuration(startTime: Date, endTime: Date): number {
	return Math.max(0, endTime.getTime() - startTime.getTime())
}

export function validateTimeRange(startTime: Date, endTime: Date): ValidationError[] {
	const errors: ValidationError[] = []

	if (startTime >= endTime) {
		errors.push({
			field: 'timeRange',
			message: 'End time must be after start time',
		})
	}

	const maxDuration = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
	if (endTime.getTime() - startTime.getTime() > maxDuration) {
		errors.push({
			field: 'timeRange',
			message: 'Session cannot be longer than 24 hours',
		})
	}

	return errors
}
