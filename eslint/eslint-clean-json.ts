/**
 * When using `--format json` option with eslint CLI, it outputs all files even if they have no issues.
 * This function filters out files with no issues and returns a JSON string.
 * It also drops the `source` property from the results.
 */
export default function (results: ESLintResult[]): string {
	// Filter out files with no issues
	const filtered = results
		.filter((r) => r.errorCount > 0 || r.warningCount > 0)
		.map((r) => ({
			filePath: r.filePath,
			messages: r.messages,
			errorCount: r.errorCount,
			warningCount: r.warningCount,
		}))
	return JSON.stringify(filtered, null, 2)
}

interface Message {
	ruleId: string
	severity: 'error' | 'warning'
	message: string
	line: number
	column: number
	endLine: number
	endColumn: number
	fix?: {
		range: [number, number]
		text: string
	}
	source: string
}

interface ESLintResult {
	filePath: string
	messages: Message[]
	errorCount: number
	warningCount: number
	source: string
}
