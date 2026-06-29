/**
 * Formats a user-facing error message for a failed session operation.
 * @param action - Short action label (e.g. "update session")
 * @param error - Caught error value
 * @returns Formatted error message
 */
export function formatOperationError(action: string, error: unknown): string {
	const message = error instanceof Error ? error.message : 'Unknown error'
	return `Failed to ${action}: ${message}`
}
