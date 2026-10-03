import { cleanup, render } from '@testing-library/vue'
import { defineComponent, nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { TimeSession } from '../types/index.ts'
import { useTimerState } from './useTimerState.ts'

const { getActiveSession } = vi.hoisted(() => ({
	getActiveSession: vi.fn<() => Promise<TimeSession | undefined>>(),
}))

vi.mock('../utils/database.ts', () => ({
	getActiveSession,
	saveSession: vi.fn(),
	updateSession: vi.fn(),
}))

describe('useTimerState', () => {
	let timerState: ReturnType<typeof useTimerState> | undefined
	let originalVisibilityState: PropertyDescriptor | undefined

	beforeEach(() => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date('2025-01-01T12:00:00'))
		originalVisibilityState = Object.getOwnPropertyDescriptor(document, 'visibilityState')
		Object.defineProperty(document, 'visibilityState', {
			configurable: true,
			value: 'visible',
		})

		getActiveSession.mockResolvedValue({
			id: 1,
			startTime: new Date(Date.now() - 5000),
			date: '2025-01-01',
			isActive: true,
			createdAt: new Date(Date.now() - 5000),
			updatedAt: new Date(Date.now() - 5000),
		})

		render(
			defineComponent({
				setup() {
					timerState = useTimerState()
					return () => null
				},
			}),
		)
	})

	afterEach(() => {
		cleanup()
		vi.useRealTimers()
		vi.resetAllMocks()
		if (originalVisibilityState) {
			Object.defineProperty(document, 'visibilityState', originalVisibilityState)
		} else {
			delete (document as Partial<Document>).visibilityState
		}
	})

	it('updates the current session duration every second and pauses while hidden', async () => {
		if (!timerState) throw new Error('Timer state was not initialized')

		await timerState.loadActiveSession()
		expect(timerState.currentSessionDuration.value).toBe(5000)

		await vi.advanceTimersByTimeAsync(1000)
		expect(timerState.currentSessionDuration.value).toBe(6000)

		Object.defineProperty(document, 'visibilityState', {
			configurable: true,
			value: 'hidden',
		})
		document.dispatchEvent(new Event('visibilitychange'))
		await nextTick()

		await vi.advanceTimersByTimeAsync(2000)
		expect(timerState.currentSessionDuration.value).toBe(6000)
	})
})
