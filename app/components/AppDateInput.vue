<script setup lang="ts">
/**
 * A date input component that provides a calendar picker interface.
 *
 * This component wraps a UPopover with a UCalendar to provide an accessible
 * date selection interface. It uses two-way binding with a DateString model
 * and handles conversion between DateString and CalendarDate formats.
 */

import { type CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
import type { DateString } from '~/types/index.ts'
import { calendarDateToDateString } from '~/utils/calendarDateToDateString.ts'
import { dateStringToCalendarDate } from '~/utils/dateStringToCalendarDate.ts'

/**
 * The selected date as a DateString in YYYY-MM-DD format.
 * This is the primary model for two-way binding with the parent component.
 */
const dateString = defineModel<DateString>({ required: true })

/**
 * Date formatter for displaying the selected date in a human-readable format.
 * Uses medium date style (e.g., "Jan 15, 2023") for consistent display.
 */
const dateFormatter = new DateFormatter('en-US', {
	dateStyle: 'medium',
})

/**
 * Computed property that provides two-way binding between DateString and CalendarDate.
 */
const selectedDate = computed<CalendarDate>({
	get() {
		return dateStringToCalendarDate(dateString.value)
	},
	set(value) {
		if (value !== undefined) {
			dateString.value = calendarDateToDateString(value)
		}
	},
})
</script>

<template>
	<UPopover>
		<UButton
			type="button"
			color="neutral"
			variant="subtle"
			icon="i-lucide-calendar"
			:aria-label="
				selectedDate
					? `Selected date: ${dateFormatter.format(selectedDate.toDate(getLocalTimeZone()))}`
					: 'Select a date'
			"
			:aria-expanded="false"
			aria-haspopup="dialog"
		>
			{{
				selectedDate
					? dateFormatter.format(selectedDate.toDate(getLocalTimeZone()))
					: 'Select a date'
			}}
		</UButton>

		<template #content>
			<UCalendar
				:model-value="selectedDate"
				class="p-2"
				aria-label="Date picker calendar"
				@update:model-value="selectedDate = $event as CalendarDate"
			/>
		</template>
	</UPopover>
</template>
