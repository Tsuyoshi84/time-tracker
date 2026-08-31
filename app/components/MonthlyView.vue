<script setup lang="ts">
/**
 * MonthlyView displays a two-pane monthly overview with a month list and daily work details.
 */

import type { ListboxItem } from '@nuxt/ui'

import AppCard from '~/components/AppCard.vue'
import MonthlyDayRow from '~/components/MonthlyDayRow.vue'
import type { DateString, DayStats, MonthStats } from '~/types/index.ts'
import { formatDuration } from '~/utils/formatDuration.ts'

const props = withDefaults(
	defineProps<{
		/** Filtered monthly statistics. */
		monthlyStats: MonthStats[]
		/** Daily statistics for the selected month. */
		dailyStats: DayStats[]
		/** Whether data is loading. */
		loading?: boolean
		/** Error message from the last failed load. */
		errorMessage?: string
	}>(),
	{
		loading: false,
		errorMessage: '',
	},
)

const selectedMonthStartDate = defineModel<DateString | undefined>('selectedMonthStartDate')

const monthListItems = computed<ListboxItem[]>(() =>
	props.monthlyStats.map((month) => ({
		label: month.monthLabel,
		description: formatDuration(month.totalDuration),
		value: month.startDate,
	})),
)

const selectedMonth = computed<MonthStats | undefined>(() =>
	props.monthlyStats.find((month) => month.startDate === selectedMonthStartDate.value),
)
</script>

<template>
	<div
		v-if="loading"
		class="py-12"
	>
		<UEmpty
			loading
			icon="i-lucide-calendar-days"
			title="Loading monthly statistics"
			description="Please wait while your monthly data is loaded."
		/>
	</div>

	<div
		v-else-if="errorMessage"
		class="py-12 text-center"
	>
		<p class="text-error">{{ errorMessage }}</p>
	</div>

	<div
		v-else-if="monthlyStats.length === 0"
		class="py-12"
	>
		<UEmpty
			icon="i-lucide-calendar-days"
			title="No months to display"
			description="Months appear here once you have at least two sessions in a month, or one session in the current month."
		/>
	</div>

	<div
		v-else
		class="grid grid-cols-1 lg:grid-cols-[minmax(240px,320px)_1fr] gap-4"
	>
		<AppCard class="overflow-hidden">
			<UListbox
				v-model="selectedMonthStartDate"
				value-key="value"
				:items="monthListItems"
				class="w-full"
			/>
		</AppCard>

		<AppCard>
			<template v-if="selectedMonth">
				<div class="mb-4 pb-4 border-b border-default">
					<h2 class="text-xl font-semibold">{{ selectedMonth.monthLabel }}</h2>
					<p class="text-sm text-toned mt-1">
						Total:
						<span class="font-semibold text-primary">
							{{ formatDuration(selectedMonth.totalDuration) }}
						</span>
					</p>
				</div>

				<UPageList divide>
					<MonthlyDayRow
						v-for="day in dailyStats"
						:key="day.date"
						:day-stats="day"
					/>
				</UPageList>
			</template>

			<UEmpty
				v-else
				icon="i-lucide-calendar"
				title="Select a month"
				description="Choose a month from the list to view daily work details."
			/>
		</AppCard>
	</div>
</template>
