/**
 * Builds a data URL for the timer favicon SVG with the given stroke color.
 *
 * @param strokeColor - CSS color for the icon stroke (e.g. `#10b981`)
 * @returns Data URL suitable for use as a favicon href
 * @example
 * buildTimerFaviconUrl('#10b981')
 */
export function buildTimerFaviconUrl(strokeColor: string): string {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>`

	return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
