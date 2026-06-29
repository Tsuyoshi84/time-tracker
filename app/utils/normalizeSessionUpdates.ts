import type { TimeSession } from '~/types/index.ts'
import { convertToDateString } from '~/utils/convertToDateString.ts'
import { diffInMilliseconds } from '~/utils/diffInMilliseconds.ts'

/**
 * Applies date and duration fields when session times are updated.
 * @param session - Existing session
 * @param updates - Partial updates from the caller
 * @returns Updates with derived date and duration when times change
 */
export function normalizeSessionUpdates(
	session: TimeSession,
	updates: Partial<TimeSession>,
): Partial<TimeSession> {
	if (!updates.startTime && !updates.endTime) return updates

	const startTime = updates.startTime ?? session.startTime
	const endTime = updates.endTime ?? session.endTime
	const normalizedUpdates: Partial<TimeSession> = {
		...updates,
		date: convertToDateString(startTime),
	}

	if (endTime) {
		normalizedUpdates.duration = diffInMilliseconds(startTime, endTime)
	}

	return normalizedUpdates
}
