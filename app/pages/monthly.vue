<script setup lang="ts">
import MonthlyView from '~/components/MonthlyView.vue'
import { useMonthlyStats } from '~/composables/useMonthlyStats.ts'
import { initDatabase } from '~/utils/database.ts'

const monthlyStats = useMonthlyStats()

onMounted(async () => {
	initDatabase()
	await monthlyStats.loadMonthlyStats()
})

const {
	monthlyStats: stats,
	dailyStatsForSelectedMonth,
	selectedMonthStartDate,
	loading,
	errorMessage,
} = monthlyStats

useSeoMeta({
	title: 'Monthly Overview - Time Tracker',
	description: 'Browse monthly work totals and daily session timelines across your history',
})
</script>

<template>
	<div class="max-w-6xl mx-auto">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-center mb-2">Monthly Overview</h1>
		</div>

		<MonthlyView
			v-model:selected-month-start-date="selectedMonthStartDate"
			:monthly-stats="stats"
			:daily-stats="dailyStatsForSelectedMonth"
			:loading="loading"
			:error-message="errorMessage"
		/>
	</div>
</template>
