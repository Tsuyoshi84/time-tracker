import { useFavicon } from '@vueuse/core'
import { computed } from 'vue'

import { useTimerState } from '~/composables/useTimerState.ts'
import { buildTimerFaviconUrl } from '~/utils/buildTimerFaviconUrl.ts'

const RUNNING_COLOR = '#10b981'
const IDLE_COLOR = '#6b7280'

/**
 * Updates the browser favicon based on timer running state.
 * Green when the timer is running, gray when idle.
 */
export function useTimerFavicon(): void {
	const { timerState } = useTimerState()

	const faviconHref = computed(() =>
		buildTimerFaviconUrl(timerState.value.isRunning ? RUNNING_COLOR : IDLE_COLOR),
	)

	useFavicon(faviconHref)
}
