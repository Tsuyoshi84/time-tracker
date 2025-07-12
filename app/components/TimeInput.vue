<template>
  <div class="inline-block">
    <input
      v-if="isEditing"
      ref="inputRef"
      v-model="editValue"
      @blur="finishEdit"
      @keydown.enter="finishEdit"
      @keydown.escape="cancelEdit"
      class="time-input"
      :class="{ 'input-error': hasError }"
      type="text"
      placeholder="HH:MM"
      :disabled="disabled"
    />
    <button
      v-else
      @click="startEdit"
      class="time-input bg-transparent border-transparent hover:border-gray-300 hover:bg-gray-50"
      :class="{ 'cursor-not-allowed opacity-50': disabled }"
      :disabled="disabled"
    >
      {{ value }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'

// Props
interface Props {
	value: string
	disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	disabled: false,
})

// Emits
const emit = defineEmits<{
	update: [value: string]
}>()

// Refs
const inputRef = ref<HTMLInputElement>()
const isEditing = ref(false)
const editValue = ref('')

// Computed
const hasError = computed(() => {
	if (!editValue.value) return false
	return !isValidTimeFormat(editValue.value)
})

// Methods
const startEdit = () => {
	if (props.disabled) return

	isEditing.value = true
	editValue.value = props.value

	nextTick(() => {
		inputRef.value?.focus()
		inputRef.value?.select()
	})
}

const finishEdit = () => {
	if (isValidTimeFormat(editValue.value)) {
		emit('update', editValue.value)
	}
	isEditing.value = false
}

const cancelEdit = () => {
	isEditing.value = false
	editValue.value = ''
}

const isValidTimeFormat = (timeString: string): boolean => {
	const pattern = /^([01]?\d|2[0-3]):([0-5]\d)$/
	return pattern.test(timeString)
}
</script>

<style scoped>
.time-input {
  min-width: 80px;
  text-align: center;
  font-family: monospace;
}

.input-error {
  @apply border-red-500 bg-red-50;
}
</style>