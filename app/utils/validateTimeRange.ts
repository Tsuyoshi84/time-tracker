export interface ValidationError {
	field: string
	message: string
}

/**
 * Validates a time range between start and end times.
 * @param startTime - The start time
 * @param endTime - The end time
 * @returns An array of validation errors, empty if valid
 */
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
