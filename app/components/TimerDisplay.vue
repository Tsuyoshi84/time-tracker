<template>
  <div class="text-center space-y-6">
    <!-- Current Session Timer -->
    <div class="stats-card">
      <div class="text-sm text-gray-600 mb-2">Current Session</div>
      <div class="timer-display text-6xl font-bold text-primary mb-4">
        {{ formatDuration(currentSessionDuration) }}
      </div>
      
      <button
        @click="toggleTimer"
        :class="[
          'btn-timer',
          isRunning ? 'active' : 'inactive'
        ]"
        :disabled="loading"
      >
        <Play v-if="!isRunning" class="w-6 h-6 mr-2" />
        <Pause v-else class="w-6 h-6 mr-2" />
        {{ isRunning ? 'Pause' : 'Start' }}
      </button>
    </div>

    <!-- Today's Total -->
    <div class="stats-card">
      <div class="text-sm text-gray-600 mb-2">Today's Total</div>
      <div class="timer-display text-4xl font-semibold text-secondary">
        {{ formatDuration(todaysTotalDuration) }}
      </div>
      <div class="text-sm text-gray-500 mt-1">
        {{ sessionCount }} session{{ sessionCount !== 1 ? 's' : '' }}
      </div>
    </div>

    <!-- Error Messages -->
    <div v-if="error" class="alert alert-error">
      <AlertCircle class="w-5 h-5" />
      <span>{{ error }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Play, Pause, AlertCircle } from 'lucide-vue-next'
import { formatDuration } from '~/types'

// Props
interface Props {
  isRunning: boolean
  currentSessionDuration: number
  todaysTotalDuration: number
  sessionCount: number
  loading?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: ''
})

// Emits
const emit = defineEmits<{
  toggleTimer: []
}>()

// Methods
const toggleTimer = () => {
  emit('toggleTimer')
}
</script>

<style scoped>
.timer-display {
  font-variant-numeric: tabular-nums;
}
</style>