<script setup lang="ts">
/**
 * A component that displays a range of dates and allows the user to navigate between them.
 */

import { Temporal } from '@js-temporal/polyfill'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
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
	const startPlainDate = Temporal.PlainDate.from(props.start.toISOString().slice(0, 10))
	const endPlainDate = Temporal.PlainDate.from(props.end.toISOString().slice(0, 10))
	const startStr = formatDate(startPlainDate)
	const endStr = formatDate(endPlainDate)
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
