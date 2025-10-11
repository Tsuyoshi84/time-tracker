<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
import type { DateString } from '~/types/index.ts'

const dateString = defineModel<DateString>({ required: true })

const df = new DateFormatter('en-US', {
	dateStyle: 'medium',
})

const date = computed<CalendarDate>({
	get() {
		const [year, month, day] = dateString.value.split('-').map(Number)
		return new CalendarDate(year!, month!, day!)
	},
	set(value) {
		dateString.value = value.toString() as DateString
	},
})
</script>

<template>
	<UPopover>
		<UButton
			color="neutral"
			variant="subtle"
			icon="i-lucide-calendar"
		>
			{{ date ? df.format(date.toDate(getLocalTimeZone())) : 'Select a date' }}
		</UButton>

		<template #content>
			<UCalendar
				v-model="date"
				class="p-2"
			/>
		</template>
	</UPopover>
</template>
