<script setup lang="ts">
/**
 * A component that displays a range of dates and allows the user to navigate between them.
 */

import type { Temporal } from '@js-temporal/polyfill'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { formatDate } from '~/utils/formatDate.ts'

const props = defineProps<{
	/** Whether the component is loading. */
	loading?: boolean
	/** The start date of the range. */
	start: Temporal.PlainDate
	/** The end date of the range. */
	end: Temporal.PlainDate
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
		<button
			type="button"
			class="btn btn-sm btn-outline"
			:disabled="loading"
			@click="$emit('previousWeek')"
		>
			<ChevronLeft class="w-4 h-4" />
		</button>
		<span class="text-sm font-medium px-3">
			{{ label }}
		</span>
		<button
			type="button"
			class="btn btn-sm btn-outline"
			:disabled="loading"
			@click="$emit('nextWeek')"
		>
			<ChevronRight class="w-4 h-4" />
		</button>
	</div>
</template>
