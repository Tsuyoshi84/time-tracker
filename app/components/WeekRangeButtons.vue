<script setup lang="ts">
/**
 * A component that displays a range of dates and allows the user to navigate between them.
 */

import { formatDate } from '~/utils/formatDate.ts'

const props = defineProps<{
	/** Whether the component is loading. */
	loading?: boolean
	/** The start date of the range. */
	start: Date
	/** The end date of the range. */
	end: Date
}>()

defineEmits<{
	/** Emitted when the user requests the previous week. */
	previousWeek: []
	/** Emitted when the user requests the next week. */
	nextWeek: []
}>()

const label = computed<string>(() => {
	const startStr = formatDate(props.start)
	const endStr = formatDate(props.end)
	return `${startStr} - ${endStr}`
})
</script>

<template>
	<div class="flex items-center space-x-2">
		<UButton
			type="button"
			color="neutral"
			variant="outline"
			size="sm"
			icon="i-lucide-chevron-left"
			:disabled="loading"
			aria-label="Previous week"
			@click="$emit('previousWeek')"
		/>
		<span class="text-sm font-medium px-3">
			{{ label }}
		</span>
		<UButton
			type="button"
			color="neutral"
			variant="outline"
			size="sm"
			icon="i-lucide-chevron-right"
			:disabled="loading"
			aria-label="Next week"
			@click="$emit('nextWeek')"
		/>
	</div>
</template>
