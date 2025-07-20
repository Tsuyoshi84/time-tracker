<script setup lang="ts">
/**
 * DaySummaryCard displays a summary of tracked time and sessions for a single day in the week view.
 */

import type { DateString, WeekDay } from '~/types/index'
import { formatDate } from '~/utils/formatDate'
import { formatDuration } from '~/utils/formatDuration'
import AppCard from './AppCard.vue'

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
	return formatDate(new Date(dateString))
}
</script>

<template>
	<AppCard
		class="p-3 text-center transition-colors cursor-pointer"
		:class="{
			'border-2 border-gray-400': props.selected,
			'border-secondary bg-secondary/10': props.weekDay.isToday,
		}"
		:aria-pressed="props.selected ? 'true' : 'false'"
		:tabindex="props.disabled ? -1 : 0"
		:aria-disabled="props.disabled ? 'true' : 'false'"
		role="button"
		@click="!props.disabled && emit('selectDay', props.weekDay.date)"
	>
		<div class="text-gray-500 text-xs mb-2 flex justify-center items-center gap-1">
			{{ formatDateLabel(props.weekDay.date) }}
			({{ props.weekDay.dayName }})
		</div>
		<div
			class="text-2xl font-semibold"
			:class="{
				'text-primary': props.weekDay.totalDuration > 0,
				'text-gray-400': props.weekDay.totalDuration === 0,
			}"
		>
			{{ formatDuration(props.weekDay.totalDuration) }}
		</div>
		<div
			class="text-xs text-gray-500 mt-1"
			:class="{
				'text-secondary': props.weekDay.sessionCount > 0,
				'text-gray-400': props.weekDay.sessionCount === 0,
			}"
		>
			{{ props.weekDay.sessionCount }} session{{ props.weekDay.sessionCount !== 1 ? 's' : '' }}
		</div>
	</AppCard>
</template>
