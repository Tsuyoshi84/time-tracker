import type { DateString, Milliseconds, TimeSession } from '../types/index.ts'
import { sumCompletedSessionDuration } from './sumCompletedSessionDuration.ts'
import { toMilliseconds } from './toMilliseconds.ts'

export function calculateTodaysTotalDuration(
	sessions: TimeSession[],
	today: DateString,
	currentSessionDuration: Milliseconds,
): Milliseconds {
	const todaySessions = sessions.filter((session) => session.date === today)

	return toMilliseconds(currentSessionDuration + sumCompletedSessionDuration(todaySessions))
}
