import type { DateString, Milliseconds, TimeSession } from '../types/index.ts'
import { toMilliseconds } from './toMilliseconds.ts'

export function calculateTodaysTotalDuration(
	sessions: TimeSession[],
	today: DateString,
	currentSessionDuration: Milliseconds,
): Milliseconds {
	const completedSessions = sessions.filter(
		(session) => session.date === today && session.endTime !== undefined,
	)

	return toMilliseconds(
		currentSessionDuration +
			completedSessions.reduce(
				(total, session) =>
					session.endTime !== undefined
						? total + (session.endTime.getTime() - session.startTime.getTime())
						: total,
				0,
			),
	)
}
