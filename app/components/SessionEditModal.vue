<script setup lang="ts">
/**
 * Modal for creating or editing a time tracking session with full date and time control.
 */

import { CalendarDate, Time } from '@internationalized/date'

import type { DateString, TimeSession } from '~/types/index.ts'
import { calculateDuration } from '~/utils/calculateDuration.ts'
import { combineDateAndTime } from '~/utils/combineDateAndTime.ts'
import { dateToCalendarDate } from '~/utils/dateToCalendarDate.ts'
import { dateToTime } from '~/utils/dateToTime.ts'
import { formatDuration } from '~/utils/formatDuration.ts'
import { getDefaultSessionTimes } from '~/utils/getDefaultSessionTimes.ts'
import { parseCalendarInput, parseTimeInputValue } from '~/utils/parseCalendarInput.ts'
import { validateTimeRange } from '~/utils/validateTimeRange.ts'

const props = withDefaults(
	defineProps<{
		/** Session being edited; omit for create mode. */
		session?: TimeSession | null
		/** Date used for default values when creating a session. */
		defaultDate: DateString
		/** Whether a save operation is in progress. */
		loading?: boolean
		/** Error message from the last failed save attempt. */
		saveError?: string
	}>(),
	{
		session: null,
		loading: false,
		saveError: '',
	},
)

const isOpen = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
	save: [payload: { startTime: Date; endTime: Date }]
}>()

const startDate = shallowRef<CalendarDate>(new CalendarDate(1970, 1, 1))
const startTime = shallowRef<Time>(new Time(0, 0))
const endDate = shallowRef<CalendarDate>(new CalendarDate(1970, 1, 1))
const endTime = shallowRef<Time>(new Time(0, 0))
const showValidationErrors = shallowRef(false)

const isCreateMode = computed(() => !props.session)

const modalTitle = computed(() => (isCreateMode.value ? 'Add session' : 'Edit session'))

function updateStartDate(value: unknown): void {
	const parsedDate = parseCalendarInput(value)
	if (parsedDate) startDate.value = parsedDate
}

function updateStartTime(value: unknown): void {
	const parsedTime = parseTimeInputValue(value)
	if (parsedTime) startTime.value = parsedTime
}

function updateEndDate(value: unknown): void {
	const parsedDate = parseCalendarInput(value)
	if (parsedDate) endDate.value = parsedDate
}

function updateEndTime(value: unknown): void {
	const parsedTime = parseTimeInputValue(value)
	if (parsedTime) endTime.value = parsedTime
}

const combinedStartTime = computed(() => combineDateAndTime(startDate.value, startTime.value))

const combinedEndTime = computed(() => combineDateAndTime(endDate.value, endTime.value))

const validationErrors = computed(() =>
	validateTimeRange(combinedStartTime.value, combinedEndTime.value),
)

const durationDisplay = computed(() => {
	if (validationErrors.value.length > 0) return '--:--:--'
	return formatDuration(calculateDuration(combinedStartTime.value, combinedEndTime.value))
})

const displayedErrors = computed(() => {
	const errors = [...validationErrors.value]
	if (props.saveError) {
		errors.push({ field: 'save', message: props.saveError })
	}
	return errors
})

function resetForm(): void {
	showValidationErrors.value = false

	if (props.session) {
		startDate.value = dateToCalendarDate(props.session.startTime)
		startTime.value = dateToTime(props.session.startTime)
		if (props.session.endTime) {
			endDate.value = dateToCalendarDate(props.session.endTime)
			endTime.value = dateToTime(props.session.endTime)
		}
		return
	}

	const { startTime: defaultStart, endTime: defaultEnd } = getDefaultSessionTimes(props.defaultDate)
	startDate.value = dateToCalendarDate(defaultStart)
	startTime.value = dateToTime(defaultStart)
	endDate.value = dateToCalendarDate(defaultEnd)
	endTime.value = dateToTime(defaultEnd)
}

function handleSave(): void {
	showValidationErrors.value = true

	if (validationErrors.value.length > 0) return

	emit('save', {
		startTime: combinedStartTime.value,
		endTime: combinedEndTime.value,
	})
}

watch(isOpen, (modalIsOpen) => {
	if (modalIsOpen) {
		resetForm()
	}
})

watch(
	() => props.defaultDate,
	() => {
		if (isOpen.value && isCreateMode.value) {
			resetForm()
		}
	},
)
</script>

<template>
	<UModal
		v-model:open="isOpen"
		:title="modalTitle"
		:description="
			isCreateMode
				? 'Set the start and end date and time for the new session.'
				: 'Adjust the start and end date and time for this session.'
		"
	>
		<template #body>
			<div class="space-y-4">
				<UFormField
					label="Start"
					name="start"
				>
					<UFieldGroup class="w-full">
						<UInputDate
							:model-value="startDate"
							size="sm"
							color="neutral"
							variant="subtle"
							class="flex-1"
							:disabled="loading || (session?.isActive ?? false)"
							@update:model-value="updateStartDate"
						/>
						<UInputTime
							:model-value="startTime"
							size="sm"
							color="neutral"
							variant="subtle"
							:hour-cycle="24"
							class="flex-1"
							:disabled="loading || (session?.isActive ?? false)"
							@update:model-value="updateStartTime"
						/>
					</UFieldGroup>
				</UFormField>

				<UFormField
					label="End"
					name="end"
				>
					<UFieldGroup class="w-full">
						<UInputDate
							:model-value="endDate"
							size="sm"
							color="neutral"
							variant="subtle"
							class="flex-1"
							:disabled="loading"
							@update:model-value="updateEndDate"
						/>
						<UInputTime
							:model-value="endTime"
							size="sm"
							color="neutral"
							variant="subtle"
							:hour-cycle="24"
							class="flex-1"
							:disabled="loading"
							@update:model-value="updateEndTime"
						/>
					</UFieldGroup>
				</UFormField>

				<div class="text-sm text-muted">
					Duration: <span class="font-mono text-default">{{ durationDisplay }}</span>
				</div>

				<UAlert
					v-if="showValidationErrors && displayedErrors.length > 0"
					color="error"
					variant="subtle"
					icon="i-lucide-circle-alert"
					:title="displayedErrors.length === 1 ? displayedErrors[0]?.message : 'Please fix the following issues'"
				>
					<template
						v-if="displayedErrors.length > 1"
						#description
					>
						<ul class="list-disc ps-4 space-y-1">
							<li
								v-for="error in displayedErrors"
								:key="error.field"
							>
								{{ error.message }}
							</li>
						</ul>
					</template>
				</UAlert>
			</div>
		</template>

		<template #footer>
			<div class="flex justify-end gap-2 w-full">
				<UButton
					color="neutral"
					variant="outline"
					label="Cancel"
					:disabled="loading"
					@click="isOpen = false"
				/>
				<UButton
					color="primary"
					:label="isCreateMode ? 'Add session' : 'Save'"
					:loading="loading"
					@click="handleSave"
				/>
			</div>
		</template>
	</UModal>
</template>
