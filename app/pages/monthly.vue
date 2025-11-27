<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AppCard from '~/components/AppCard.vue'
import { useMonthlyStats } from '~/composables/useMonthlyStats.ts'
import { initDatabase } from '~/utils/database.ts'
import { formatDuration } from '~/utils/formatDuration.ts'

// Initialize composables
const monthlyStats = useMonthlyStats()

// Initialize on mount
onMounted(async () => {
	initDatabase()
	await monthlyStats.loadMonthlyStats()
})

// Extract values
const { monthlyStats: stats, error } = monthlyStats

// Loading state
const loading = computed(() => stats.value.length === 0 && !error.value)

// SEO
useSeoMeta({
	title: 'Monthly Overview - Time Tracker',
	description: 'View your monthly time tracking statistics for the last 6 months',
})
</script>

<template>
	<div class="max-w-6xl mx-auto">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-center mb-2">Monthly Overview</h1>
			<p class="text-center text-toned">
				Track your monthly progress and analyze your work patterns over time
			</p>
		</div>

		<!-- Loading State -->
		<div
			v-if="loading"
			class="text-center py-12"
		>
			<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
			<p class="mt-4 text-toned">Loading monthly statistics...</p>
		</div>

		<!-- Error State -->
		<div
			v-else-if="error"
			class="text-center py-12"
		>
			<p class="text-error">{{ error }}</p>
		</div>

		<!-- Monthly Stats Grid -->
		<div
			v-else
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
		>
			<AppCard
				v-for="month in stats"
				:key="month.startDate"
				class="text-center"
			>
				<div class="text-sm text-toned mb-2">{{ month.monthLabel }}</div>
				<div class="text-2xl font-bold text-primary mb-2">
					{{ formatDuration(month.totalDuration) }}
				</div>
				<div class="text-sm text-muted">
					{{ month.sessionCount }} {{ month.sessionCount === 1 ? 'session' : 'sessions' }}
				</div>
			</AppCard>
		</div>
	</div>
</template>
