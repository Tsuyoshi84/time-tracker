<script setup lang="ts">
import { Clock, Plus, Trash2 } from 'lucide-vue-next'
import type { TimeSession, ValidationError } from '~/types'
import {
	calculateDuration,
	formatDuration,
	formatTime,
	parseTimeInput,
	validateTimeRange,
} from '~/types'
import TimeInput from './TimeInput.vue'

withDefaults(
	defineProps<{
		sessions: TimeSession[]
		loading?: boolean
	}>(),
	{
		loading: false,
	},
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
      <button
        class="btn btn-sm btn-primary"
        :disabled="loading"
        type="button"
        @click="$emit('addManualSession')"
      >
        <Plus class="w-4 h-4 mr-1" />
        Add Session
      </button>
    </div>

    <div v-if="sessions.length === 0" class="text-center py-8 text-gray-500">
      <Clock class="w-12 h-12 mx-auto mb-2 opacity-50" />
      <p>No sessions for this day</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="session in sessions"
        :key="session.id"
        class="bg-base-100 border border-base-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        :class="{ 'bg-green-100': session.isActive }"
      >
        <div class="grid grid-cols-[1fr_2rem] items-center justify-between">
          <div class="grid grid-cols-[6rem_1fr_6rem] items-center gap-4">
            <!-- Session Status -->
            <div class="flex items-center">
              <div
                class="w-3 h-3 rounded-full"
                :class="session.isActive ? 'bg-green-500' : 'bg-gray-300'"
              />
              <span class="ml-2 text-sm font-medium">
                {{ session.isActive ? "Active" : "Completed" }}
              </span>
            </div>

            <!-- Time Range -->
            <div class="flex items-center space-x-2">
              <TimeInput
                :value="formatTime(session.startTime)"
                :disabled="loading"
                :readonly="session.isActive"
                @update="(value) => updateStartTime(session, value)"
              />
              <span class="text-gray-400">-</span>
              <TimeInput
                v-if="session.endTime"
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
          <div class="flex items-center space-x-2">
            <button
              v-if="!session.isActive"
              type="button"
              class="btn btn-sm btn-ghost text-red-500 hover:bg-red-50"
              :disabled="loading"
              @click="deleteSession(session)"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Validation Errors -->
        <div v-if="getSessionErrors(session).length > 0" class="mt-2">
          <div
            v-for="error in getSessionErrors(session)"
            :key="error.field"
            class="text-sm text-red-600"
          >
            {{ error.message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
