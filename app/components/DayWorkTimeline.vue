<script setup lang="ts">
/**
 * DayWorkTimeline renders completed sessions as segments on a fixed 24-hour day axis.
 */

import type { DateString, TimeSession } from '~/types/index.ts'
import { buildTimelineSegments } from '~/utils/buildTimelineSegments.ts'
import { formatSessionTimeRange } from '~/utils/formatSessionTimeRange.ts'

const props = defineProps<{
	/** Sessions for the day; only completed sessions are rendered. */
	sessions: TimeSession[]
	/** Calendar date in YYYY-MM-DD format. */
	dayDate: DateString
}>()

const segments = computed(() => buildTimelineSegments(props.sessions, props.dayDate))
</script>

<template>
	<div
		class="relative h-2.5 rounded-full bg-elevated border border-default min-w-0"
		role="img"
		:aria-label="`${segments.length} work session${segments.length === 1 ? '' : 's'}`"
	>
		<UTooltip
			v-for="segment in segments"
			:key="`${segment.startTime.getTime()}-${segment.endTime.getTime()}`"
			:text="formatSessionTimeRange(segment.startTime, segment.endTime)"
		>
			<div
				class="absolute top-0 h-full rounded-full bg-primary"
				:style="{
					left: `${segment.leftPercent}%`,
					width: `${segment.widthPercent}%`,
				}"
			/>
		</UTooltip>
	</div>
</template>
