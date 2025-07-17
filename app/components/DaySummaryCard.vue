<script setup lang="ts">
/**
 * DaySummaryCard displays a summary of tracked time and sessions for a single day in the week view.
 */

import type { DateString, WeekDay } from "~/types/index"
import { formatDuration } from "~/types/index"

const props = defineProps<{
	/** The week day. */
	weekDay: WeekDay
	/** Whether this day is selected. */
	selected: boolean
	/** Whether the card is disabled (e.g., loading). */
	disabled: boolean
}>()

const emit = defineEmits<{ selectDay: [date: DateString] }>()

function formatDateLabel(dateString: string): string {
	const date = new Date(dateString)
	return date.toLocaleDateString("en-US", { month: "numeric", day: "numeric" })
}
</script>

<template>
	<div
		class="bg-base-100 border border-base-300 rounded-lg p-3 text-center hover:bg-base-200 transition-colors cursor-pointer"
		:class="{
			'border-primary bg-primary/10': props.selected,
			'border-secondary bg-secondary/10': props.weekDay.isToday,
		}"
		:aria-pressed="props.selected ? 'true' : 'false'"
		:tabindex="props.disabled ? -1 : 0"
		:aria-disabled="props.disabled ? 'true' : 'false'"
		@click="!props.disabled && emit('selectDay', props.weekDay.date)"
	>
		<div class="text-gray-500 mb-2 flex justify-center items-center gap-1">
			<span>{{ formatDateLabel(props.weekDay.date) }}</span
			><span class="text-xs">({{ props.weekDay.dayName }})</span>
		</div>
		<div class="text-lg font-semibold text-primary">
			{{ formatDuration(props.weekDay.totalDuration) }}
		</div>
		<div class="text-xs text-gray-500 mt-1">
			{{ props.weekDay.sessionCount }} session{{
				props.weekDay.sessionCount !== 1 ? "s" : ""
			}}
		</div>
	</div>
</template>
