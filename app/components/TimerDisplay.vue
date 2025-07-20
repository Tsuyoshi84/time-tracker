<script setup lang="ts">
import { AlertCircle, Pause, Play } from 'lucide-vue-next'
import type { Milliseconds } from '~/types'
import { formatDuration } from '~/utils/formatDuration'
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
	}
)

defineEmits<{
	toggleTimer: []
}>()
</script>

<template>
	<div class="text-center space-y-6">
		<!-- Current Session Timer -->
		<AppCard>
			<div class="text-sm text-gray-600 mb-2">Current Session</div>
			<div class="font-inter text-6xl tabular-nums font-bold text-primary mb-4">
				{{ formatDuration(currentSessionDuration) }}
			</div>

			<button
				class="btn btn-lg min-h-16 px-8 font-semibold text-2xl"
				:class="{ 'btn-warning': isRunning, 'btn-success': !isRunning }"
				:disabled="loading"
				type="button"
				@click="$emit('toggleTimer')"
			>
				<Play
					v-if="!isRunning"
					class="w-6 h-6 mr-2"
				/>
				<Pause
					v-else
					class="w-6 h-6 mr-2"
				/>
				{{ isRunning ? 'Pause' : 'Start' }}
			</button>
		</AppCard>

		<!-- Today's Total -->
		<AppCard>
			<div class="text-sm text-gray-600 mb-2">Today's Total</div>
			<div class="font-inter text-4xl tabular-nums font-semibold text-secondary">
				{{ formatDuration(todaysTotalDuration) }}
			</div>
			<div class="text-sm text-gray-500 mt-1">
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
