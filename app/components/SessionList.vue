<script setup lang="ts">
/**
 * SessionList displays and manages time tracking sessions, allowing users to view, edit, and delete session entries.
 */

import { Clock } from 'lucide-vue-next'

import SessionEditModal from '~/components/SessionEditModal.vue'
import type { DateString, TimeSession } from '~/types/index.ts'
import { calculateDuration } from '~/utils/calculateDuration.ts'
import { formatDuration } from '~/utils/formatDuration.ts'
import { formatSessionTimeRange } from '~/utils/formatSessionTimeRange.ts'
import { formatTime } from '~/utils/formatTime.ts'

withDefaults(
	defineProps<{
		/** Array of time sessions to display. */
		sessions: TimeSession[]
		/** The date currently selected in the day view. */
		selectedDate: DateString
		/** Whether the component is loading. */
		loading?: boolean
		/** Error message from the last failed save attempt. */
		saveError?: string
	}>(),
	{
		loading: false,
		saveError: '',
	},
)

const emit = defineEmits<{
	updateSession: [session: TimeSession, updates: Partial<TimeSession>]
	createSession: [payload: { startTime: Date; endTime: Date }]
	deleteSession: [session: TimeSession]
	clearSaveError: []
}>()

const isModalOpen = shallowRef(false)
const editingSession = shallowRef<TimeSession | null>(null)

function openCreateModal(): void {
	emit('clearSaveError')
	editingSession.value = null
	isModalOpen.value = true
}

function openEditModal(session: TimeSession): void {
	emit('clearSaveError')
	editingSession.value = session
	isModalOpen.value = true
}

function handleSave(payload: { startTime: Date; endTime: Date }): void {
	if (editingSession.value) {
		emit('updateSession', editingSession.value, {
			startTime: payload.startTime,
			endTime: payload.endTime,
		})
		return
	}

	emit('createSession', payload)
}

watch(isModalOpen, (open) => {
	if (!open) {
		editingSession.value = null
	}
})

function deleteSession(session: TimeSession): void {
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

function getTimeRangeDisplay(session: TimeSession): string {
	if (session.endTime) {
		return formatSessionTimeRange(session.startTime, session.endTime)
	}

	return formatTime(session.startTime)
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
				@click="openCreateModal"
			>
				Add Session
			</UButton>
		</div>

		<div
			v-if="sessions.length === 0"
			class="text-center py-8 text-muted"
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
				:class="{ 'bg-primary ': session.isActive }"
			>
				<div class="grid grid-cols-[1fr_auto] items-center justify-between gap-4">
					<div class="grid grid-cols-[6rem_1fr_6rem] items-center gap-4 min-w-0">
						<!-- Session Status -->
						<div class="flex items-center text-toned">
							<div
								class="w-3 h-3 rounded-full"
								:class="session.isActive ? 'bg-primary text-default' : 'bg-secondary'"
							/>
							<span class="ml-2 text-sm font-medium text-inverted">
								{{ session.isActive ? 'Active' : 'Completed' }}
							</span>
						</div>

						<!-- Time Range -->
						<button
							type="button"
							class="text-left text-sm font-mono truncate hover:underline disabled:no-underline disabled:cursor-default"
							:class="{ 'text-inverted': session.isActive }"
							:disabled="loading || session.isActive"
							@click="openEditModal(session)"
						>
							{{ getTimeRangeDisplay(session) }}
						</button>

						<!-- Duration -->
						<div class="text-sm font-mono">
							{{ getDurationDisplay(session) }}
						</div>
					</div>

					<!-- Actions -->
					<div class="flex items-center gap-1">
						<UButton
							v-if="!session.isActive"
							icon="i-lucide-pencil"
							size="md"
							color="neutral"
							variant="soft"
							:disabled="loading"
							title="Edit session"
							aria-label="Edit session"
							@click="openEditModal(session)"
						/>
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
				</div>
			</UCard>
		</div>

		<SessionEditModal
			v-model:open="isModalOpen"
			:session="editingSession"
			:default-date="selectedDate"
			:loading="loading"
			:save-error="saveError"
			@save="handleSave"
		/>
	</div>
</template>
