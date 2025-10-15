<script setup lang="ts">
/**
 * SessionList displays and manages time tracking sessions, allowing users to view, edit, and delete session entries.
 */

import { Clock } from 'lucide-vue-next'
import type { TimeSession } from '~/types/index.ts'
import { calculateDuration } from '~/utils/calculateDuration.ts'
import { formatDuration } from '~/utils/formatDuration.ts'
import { formatTime } from '~/utils/formatTime.ts'
import { parseTimeInput } from '~/utils/parseTimeInput.ts'
import type { ValidationError } from '~/utils/validateTimeRange.ts'
import { validateTimeRange } from '~/utils/validateTimeRange.ts'
import TimeInput from './TimeInput.vue'

withDefaults(
	defineProps<{
		/** Array of time sessions to display. */
		sessions: TimeSession[]
		/** Whether the component is loading. */
		loading?: boolean
	}>(),
	{
		loading: false,
	}
)

const emit = defineEmits<{
	updateSession: [session: TimeSession, updates: Partial<TimeSession>]
	deleteSession: [session: TimeSession]
	addManualSession: []
}>()

function updateStartTime(session: TimeSession, timeString: string) {
	const newStartTime = parseTimeInput(timeString)
	if (newStartTime) {
		emit('updateSession', session, { startTime: newStartTime })
	}
}

function updateEndTime(session: TimeSession, timeString: string) {
	const newEndTime = parseTimeInput(timeString)
	if (newEndTime) {
		emit('updateSession', session, { endTime: newEndTime })
	}
}

function deleteSession(session: TimeSession) {
	if (confirm('Are you sure you want to delete this session?')) {
		emit('deleteSession', session)
	}
}

function getDurationDisplay(session: TimeSession): string {
	if (session.isActive) return 'Running...'

	if (session.endTime) {
		const duration = calculateDuration(session.startTime, session.endTime)
		return formatDuration(duration)
	}

	return '--:--:--'
}

function getSessionErrors(session: TimeSession): ValidationError[] {
	if (!session.endTime) return []

	return validateTimeRange(session.startTime, session.endTime)
}
</script>

<template>
	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<h3 class="text-lg font-semibold">Sessions</h3>
			<UButton
				color="primary"
				size="sm"
				:disabled="loading"
				type="button"
				icon="i-lucide-plus"
				@click="$emit('addManualSession')"
			>
				Add Session
			</UButton>
		</div>

		<div
			v-if="sessions.length === 0"
			class="text-center py-8 text-gray-500"
		>
			<Clock class="w-12 h-12 mx-auto mb-2 opacity-50" />
			<p>No sessions for this day</p>
		</div>

		<div
			v-else
			class="space-y-3"
		>
			<UCard
				v-for="session in sessions"
				:key="session.id"
				:class="{ 'bg-green-100 dark:bg-green-300': session.isActive }"
			>
				<div class="grid grid-cols-[1fr_2rem] items-center justify-between">
					<div class="grid grid-cols-[6rem_1fr_6rem] items-center gap-4">
						<!-- Session Status -->
						<div class="flex items-center dark:text-gray-600">
							<div
								class="w-3 h-3 rounded-full"
								:class="session.isActive ? 'bg-primary text-gray-700' : 'bg-gray-300'"
							/>
							<span class="ml-2 text-sm font-medium">
								{{ session.isActive ? 'Active' : 'Completed' }}
							</span>
						</div>

						<!-- Time Range -->
						<div class="flex items-center space-x-2">
							<TimeInput
								:class="{ 'text-gray-600': session.isActive }"
								:value="formatTime(session.startTime)"
								:disabled="loading"
								:readonly="session.isActive"
								@update="(value) => updateStartTime(session, value)"
							/>
							<span class="text-gray-400">-</span>
							<TimeInput
								v-if="session.endTime"
								:class="{ 'text-gray-700': session.isActive }"
								:value="formatTime(session.endTime)"
								:disabled="loading"
								@update="(value) => updateEndTime(session, value)"
							/>
						</div>

						<!-- Duration -->
						<div class="text-sm font-mono text-gray-600">
							{{ getDurationDisplay(session) }}
						</div>
					</div>

					<!-- Actions -->
					<UButton
						v-if="!session.isActive"
						icon="i-lucide-trash-2"
						size="md"
						color="error"
						variant="soft"
						:disabled="loading"
						title="Delete session"
						aria-label="Delete session"
						@click="deleteSession(session)"
					/>
				</div>

				<!-- Validation Errors -->
				<div
					v-if="getSessionErrors(session).length > 0"
					class="mt-2"
				>
					<div
						v-for="error in getSessionErrors(session)"
						:key="error.field"
						class="text-sm text-red-600"
					>
						{{ error.message }}
					</div>
				</div>
			</UCard>
		</div>
	</div>
</template>
