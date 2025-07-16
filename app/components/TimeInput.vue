<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'

const props = withDefaults(
	defineProps<{
		value: string
		disabled?: boolean
	}>(),
	{
		disabled: false,
	},
)

const emit = defineEmits<{
	update: [value: string]
}>()

const inputRef = ref<HTMLInputElement>()
const isEditing = ref(false)
const editValue = ref('')

const hasError = computed(() => {
	if (!editValue.value) return false
	return !isValidTimeFormat(editValue.value)
})

function startEdit() {
	if (props.disabled) return

	isEditing.value = true
	editValue.value = props.value

	nextTick(() => {
		inputRef.value?.focus()
		inputRef.value?.select()
	})
}

function finishEdit() {
	if (isValidTimeFormat(editValue.value)) {
		emit('update', editValue.value)
	}
	isEditing.value = false
}

function cancelEdit() {
	isEditing.value = false
	editValue.value = ''
}

function isValidTimeFormat(timeString: string): boolean {
	const pattern = /^([01]?\d|2[0-3]):([0-5]\d)$/
	return pattern.test(timeString)
}
</script>

<template>
  <div class="inline-block">
    <input
      v-if="isEditing"
      ref="inputRef"
      v-model="editValue"
      class="input border input-sm w-20 text-center font-mono"
      :class="{ 'border-red-500 bg-red-50': hasError }"
      type="text"
      placeholder="HH:MM"
      :disabled="disabled"
      @blur="finishEdit"
      @keydown.enter="finishEdit"
      @keydown.escape="cancelEdit"
    >
    <button
      v-else
      class="input border input-sm w-20 content-center grid font-mono bg-transparent border-transparent hover:border-gray-300 hover:bg-gray-50 transition-all "
      :class="{ 'cursor-not-allowed opacity-50': disabled }"
      :disabled="disabled"
      type="button"
      @click="startEdit"
    >
      {{ value }}
    </button>
  </div>
</template>

