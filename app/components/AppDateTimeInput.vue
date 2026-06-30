<script setup lang="ts">
/**
 * Combined date and time input using UInputDate and UInputTime in a field group.
 */

import { combineDateAndTime } from '~/utils/combineDateAndTime.ts'
import { dateToCalendarDate } from '~/utils/dateToCalendarDate.ts'
import { dateToTime } from '~/utils/dateToTime.ts'
import { parseCalendarInput, parseTimeInputValue } from '~/utils/parseCalendarInput.ts'

const model = defineModel<Date>({ required: true })

const props = withDefaults(
	defineProps<{
		/** Accessible name for the date input. */
		dateAriaLabel: string
		/** Accessible name for the time input. */
		timeAriaLabel: string
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
		color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
		variant?: 'outline' | 'soft' | 'subtle' | 'ghost' | 'none'
		disabled?: boolean
	}>(),
	{
		size: 'sm',
		color: 'neutral',
		variant: 'subtle',
		disabled: false,
	},
)

const datePart = computed(() => dateToCalendarDate(model.value))
const timePart = computed(() => dateToTime(model.value))

function updateDate(value: unknown): void {
	const parsedDate = parseCalendarInput(value)
	if (parsedDate) {
		model.value = combineDateAndTime(parsedDate, timePart.value)
	}
}

function updateTime(value: unknown): void {
	const parsedTime = parseTimeInputValue(value)
	if (parsedTime) {
		model.value = combineDateAndTime(datePart.value, parsedTime)
	}
}
</script>

<template>
	<UFieldGroup class="w-full">
		<UInputDate
			:model-value="datePart"
			:size="props.size"
			:color="props.color"
			:variant="props.variant"
			:aria-label="props.dateAriaLabel"
			class="flex-1"
			:disabled="props.disabled"
			@update:model-value="updateDate"
		/>
		<UInputTime
			:model-value="timePart"
			:size="props.size"
			:color="props.color"
			:variant="props.variant"
			:aria-label="props.timeAriaLabel"
			:hour-cycle="24"
			class="flex-1"
			:disabled="props.disabled"
			@update:model-value="updateTime"
		/>
	</UFieldGroup>
</template>
