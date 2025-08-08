/**
 * Theme management composable using VueUse `useColorMode`.
 *
 * - Default follows user's system preference (auto)
 * - Persists explicit choice in localStorage under `theme-preference`
 * - Applies `data-theme` to `<html>` for DaisyUI and syncs Tailwind's `dark` class
 */

import { useColorMode } from '@vueuse/core'
import { computed } from 'vue'

const STORAGE_KEY = 'theme-preference'

export function useTheme() {
	const mode = useColorMode({
		selector: 'html',
		attribute: 'data-theme',
		initialValue: 'auto',
		storageKey: STORAGE_KEY,
		modes: {
			light: 'light',
			dark: 'dark',
		},
		onChanged: (value, defaultHandler) => {
			// Apply data-theme via the library's default handler
			defaultHandler(value)
			// Keep Tailwind's dark: utilities in sync
			if (typeof document !== 'undefined') {
				document.documentElement.classList.toggle('dark', value === 'dark')
			}
		},
	})

	// `mode.value` is always the effective mode ('light' | 'dark') unless emitAuto is enabled.
	const effective = computed<'light' | 'dark'>(() => (mode.value === 'dark' ? 'dark' : 'light'))
	const isDark = computed<boolean>(() => mode.value === 'dark')

	// Store reflects user preference ('light' | 'dark' | 'auto').
	// Expose preference as undefined when following system ('auto').
	const preference = computed<'light' | 'dark' | undefined>(() =>
		mode.store.value === 'auto' ? undefined : (mode.store.value as 'light' | 'dark'),
	)

	function setPreference(next: 'light' | 'dark' | undefined): void {
		if (next === undefined) {
			mode.value = 'auto'
			return
		}
		mode.value = next
	}

	function toggleTheme(): void {
		mode.value = isDark.value ? 'light' : 'dark'
	}

	return {
		preference,
		effective,
		isDark,
		toggleTheme,
		setPreference,
	}
}
