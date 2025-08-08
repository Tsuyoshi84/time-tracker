/*
 * Eagerly initialize color mode on client to avoid attribute/class mismatch and FOUC.
 */
import { defineNuxtPlugin } from '#app'
import { useTheme } from '../composables/useTheme.ts'

export default defineNuxtPlugin(() => {
	// Client-only guard
	if (!import.meta.client) return
	// Initialize color mode and sync Tailwind/DaisyUI immediately
	const { isDark } = useTheme()
	// Touch the ref to ensure it’s used, preventing tree-shake
	void isDark.value
})
