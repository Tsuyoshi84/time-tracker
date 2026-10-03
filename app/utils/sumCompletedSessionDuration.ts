import type { Milliseconds, TimeSession } from '../types/index.ts'
import { diffInMilliseconds } from './diffInMilliseconds.ts'
import { toMilliseconds, ZERO_MILLISECONDS } from './toMilliseconds.ts'

export function sumCompletedSessionDuration(sessions: ReadonlyArray<TimeSession>): Milliseconds {
	return sessions.reduce<Milliseconds>(
		(total, session) =>
			session.endTime === undefined
				? total
				: toMilliseconds(total + diffInMilliseconds(session.startTime, session.endTime)),
		ZERO_MILLISECONDS,
	)
}
