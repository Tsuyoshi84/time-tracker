<script setup lang="ts">
/**
 * TimerDisplay shows the current session timer, today's total time, and timer controls.
 */

import { AlertCircle } from 'lucide-vue-next'
import type { Milliseconds } from '~/types/index.ts'
import { formatDuration } from '~/utils/formatDuration.ts'
import AppCard from './AppCard.vue'

withDefaults(
	defineProps<{
		/** Indicates if the timer is currently running. */
		isRunning: boolean
		/** Duration of the current session in milliseconds. */
		currentSessionDuration: Milliseconds
		/** Total duration for today in milliseconds. */
		todaysTotalDuration: Milliseconds
		/** Number of sessions for today. */
		sessionCount: number
		/** Whether the timer is in a loading state. */
		loading?: boolean
		/** Error message to display, if any. */
		error?: string
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
	<div class="text-center space-y-6">
		<!-- Current Session Timer -->
		<AppCard>
			<div class="text-sm text-info mb-2">Current Session</div>
			<div class="font-inter text-6xl tabular-nums font-bold text-primary mb-4">
				{{ formatDuration(currentSessionDuration) }}
			</div>

			<UButton
				:label="isRunning ? 'Pause' : 'Start'"
				:icon="isRunning ? 'i-lucide-pause' : 'i-lucide-play'"
				:color="isRunning ? 'warning' : 'primary'"
				size="xl"
				@click="$emit('toggleTimer')"
			/>
		</AppCard>

		<!-- Today's Total -->
		<AppCard>
			<div class="text-sm text-info mb-2">Today's Total</div>
			<div class="font-inter text-4xl tabular-nums font-semibold text-secondary">
				{{ formatDuration(todaysTotalDuration) }}
			</div>
			<div class="text-sm text-info mt-1">
				{{ sessionCount }} session{{ sessionCount !== 1 ? 's' : '' }}
			</div>
		</AppCard>

		<!-- Error Messages -->
		<div
			v-if="error"
			class="alert alert-error"
		>
			<AlertCircle class="w-5 h-5" />
			<span>{{ error }}</span>
		</div>
	</div>
</template>
