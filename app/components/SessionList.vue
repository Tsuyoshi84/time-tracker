<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Sessions</h3>
      <button
        @click="addManualSession"
        class="btn btn-sm btn-primary"
        :disabled="loading"
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
        :class="[
          'session-item',
          { 'active': session.isActive }
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Session Status -->
            <div class="flex items-center">
              <div
                :class="[
                  'w-3 h-3 rounded-full',
                  session.isActive ? 'bg-green-500' : 'bg-gray-300'
                ]"
              />
              <span class="ml-2 text-sm font-medium">
                {{ session.isActive ? 'Active' : 'Completed' }}
              </span>
            </div>

            <!-- Time Range -->
            <div class="flex items-center space-x-2">
              <TimeInput
                :value="formatTime(session.startTime)"
                @update="(value) => updateStartTime(session, value)"
                :disabled="session.isActive || loading"
              />
              <span class="text-gray-400">-</span>
              <TimeInput
                v-if="session.endTime"
                :value="formatTime(session.endTime)"
                @update="(value) => updateEndTime(session, value)"
                :disabled="loading"
              />
              <span v-else class="text-gray-400 text-sm">Running...</span>
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
              @click="deleteSession(session)"
              class="btn btn-sm btn-ghost text-red-500 hover:bg-red-50"
              :disabled="loading"
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

<script setup lang="ts">
import { Plus, Clock, Trash2 } from 'lucide-vue-next'
import { formatTime, formatDuration, parseTimeInput, validateTimeRange, calculateDuration } from '~/types'
import type { TimeSession, ValidationError } from '~/types'
import TimeInput from './TimeInput.vue'

// Props
interface Props {
  sessions: TimeSession[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

// Emits
const emit = defineEmits<{
  updateSession: [session: TimeSession, updates: Partial<TimeSession>]
  deleteSession: [session: TimeSession]
  addManualSession: []
}>()

// Methods
const updateStartTime = (session: TimeSession, timeString: string) => {
  const newStartTime = parseTimeInput(timeString)
  if (newStartTime) {
    emit('updateSession', session, { startTime: newStartTime })
  }
}

const updateEndTime = (session: TimeSession, timeString: string) => {
  const newEndTime = parseTimeInput(timeString)
  if (newEndTime) {
    emit('updateSession', session, { endTime: newEndTime })
  }
}

const deleteSession = (session: TimeSession) => {
  if (confirm('Are you sure you want to delete this session?')) {
    emit('deleteSession', session)
  }
}

const addManualSession = () => {
  emit('addManualSession')
}

const getDurationDisplay = (session: TimeSession): string => {
  if (session.isActive) {
    return 'Running...'
  }
  
  if (session.endTime) {
    const duration = calculateDuration(session.startTime, session.endTime)
    return formatDuration(duration)
  }
  
  return '--:--:--'
}

const getSessionErrors = (session: TimeSession): ValidationError[] => {
  if (!session.endTime) return []
  
  return validateTimeRange(session.startTime, session.endTime)
}
</script>