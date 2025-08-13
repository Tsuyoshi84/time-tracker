<script setup lang="ts">
/**
 * TimeInput provides an editable time input field that allows users to enter and modify time values in HH:MM format.
 */

import { computed, nextTick, ref, useTemplateRef } from 'vue'

const inputRef = useTemplateRef<HTMLInputElement>('inputRef')

const hasError = computed<boolean>(() => {
  if (!editValue.value) return false
  return !isValidTimeFormat(editValue.value)
})

// …apply `computed<boolean>` to your other computed() calls below as well.

const props = withDefaults(
	defineProps<{
		value: string
		disabled?: boolean
		readonly?: boolean
	}>(),
	{},
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
			class="input border input-sm w-20 text-center font-mono text-lg"
			:class="{ 'border-red-500 bg-red-50': hasError }"
			type="text"
			placeholder="HH:MM"
			:disabled="disabled"
			@blur="finishEdit"
			@keydown.enter="finishEdit"
			@keydown.escape="cancelEdit"
		>
		<span
			v-else-if="props.readonly"
			class="input border input-sm w-20 text-lg content-center grid font-mono bg-transparent border-transparent text-center"
			>{{ value }}</span
		>
		<button
			v-else
			class="input border input-sm w-20 text-lg content-center grid font-mono bg-transparent border-transparent hover:border-gray-300 hover:bg-gray-50 transition-all"
			:class="{ 'cursor-not-allowed bg-transparent': disabled }"
			:disabled="disabled"
			type="button"
			@click="startEdit"
		>
			{{ value }}
		</button>
	</div>
</template>
