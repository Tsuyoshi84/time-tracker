export interface TimeSession {
  id?: number
  startTime: Date
  endTime?: Date
  duration?: number // in milliseconds
  date: string // YYYY-MM-DD format
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface DayStats {
  date: string // YYYY-MM-DD format
  totalDuration: number // in milliseconds
  sessionCount: number
  sessions: TimeSession[]
}

export interface WeekStats {
  weekStart: string // YYYY-MM-DD format
  weekEnd: string // YYYY-MM-DD format
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

export const formatDuration = (milliseconds: number): string => {
  if (milliseconds <= 0) return '0:00:00'
  
  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  const pad = (num: number): string => num < 10 ? `0${num}` : `${num}`
  
  return `${hours}:${pad(minutes)}:${pad(seconds)}`
}

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

export const parseTimeInput = (timeString: string): Date | null => {
  const match = timeString.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return null
  
  const hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null
  
  const today = new Date()
  const result = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes)
  return result
}

export const calculateDuration = (startTime: Date, endTime: Date): number => {
  return Math.max(0, endTime.getTime() - startTime.getTime())
}

export const validateTimeRange = (startTime: Date, endTime: Date): ValidationError[] => {
  const errors: ValidationError[] = []
  
  if (startTime >= endTime) {
    errors.push({
      field: 'timeRange',
      message: 'End time must be after start time'
    })
  }
  
  const maxDuration = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  if (endTime.getTime() - startTime.getTime() > maxDuration) {
    errors.push({
      field: 'timeRange',
      message: 'Session cannot be longer than 24 hours'
    })
  }
  
  return errors
}