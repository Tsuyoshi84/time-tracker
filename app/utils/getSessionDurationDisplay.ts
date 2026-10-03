import type { TimeSession } from '../types/index.ts'
import { calculateDuration } from './calculateDuration.ts'
import { formatDuration } from './formatDuration.ts'

export function getSessionDurationDisplay(session: TimeSession): string {
	if (session.isActive) return 'Running...'

	if (session.endTime) {
		const duration = calculateDuration(session.startTime, session.endTime)
		return formatDuration(duration)
	}

	return '--:--:--'
}
