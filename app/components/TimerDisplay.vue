<script setup lang="ts">
/**
 * TimerDisplay shows the current session timer, today's total time, and timer controls.
 */

import type { Milliseconds } from '~/types/index.ts'
import { formatDuration } from '~/utils/formatDuration.ts'

withDefaults(
	defineProps<{
		/** Indicates if the timer is currently running. */
		isRunning: boolean
		/** Duration of the current session in milliseconds. */
		currentSessionDuration: Milliseconds
		/** Total duration for today in milliseconds. */
		todaysTotalDuration: Milliseconds
		/** Total duration for this week in milliseconds. */
		weeklyTotalDuration: Milliseconds
		/** Number of sessions for today. */
		sessionCount: number
		/** Whether the timer is in a loading state. */
		loading?: boolean
	}>(),
	{
		loading: false,
		error: '',
	},
)

defineEmits<{
	toggleTimer: []
}>()
</script>

<template>
	<UPageGrid class="grid-cols-2 lg:grid-cols-2">
		<!-- Current Session Timer -->
		<UPageCard class="col-span-2">
			<div class="text-sm text-info mb-2">Current Session</div>
			<div class="font-inter text-6xl tabular-nums font-bold text-primary mb-4">
				{{ formatDuration(currentSessionDuration) }}
			</div>

			<UButton
				class="justify-center"
				:label="isRunning ? 'Pause' : 'Start'"
				:icon="isRunning ? 'i-lucide-pause' : 'i-lucide-play'"
				:color="isRunning ? 'warning' : 'primary'"
				size="xl"
				@click="$emit('toggleTimer')"
			/>
		</UPageCard>

		<!-- Today's Total -->
		<UPageCard class="col-span-1">
			<div class="text-sm text-info-300 mb-2">Today's Total</div>
			<div class="font-inter text-4xl tabular-nums font-semibold text-info">
				{{ formatDuration(todaysTotalDuration) }}
			</div>
		</UPageCard>

		<UPageCard class="col-span-1">
			<div class="text-sm text-warning-300 mb-2">This Week's Total</div>
			<div class="font-inter text-4xl tabular-nums font-semibold text-warning">
				{{ formatDuration(todaysTotalDuration) }}
			</div>
		</UPageCard>
	</UPageGrid>
</template>
