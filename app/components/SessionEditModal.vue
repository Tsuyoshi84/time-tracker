<script setup lang="ts">
/**
 * Modal for creating or editing a time tracking session with full date and time control.
 */

import AppDateTimeInput from '~/components/AppDateTimeInput.vue'
import type { DateString, TimeSession } from '~/types/index.ts'
import { calculateDuration } from '~/utils/calculateDuration.ts'
import { formatDuration } from '~/utils/formatDuration.ts'
import { getDefaultSessionTimes } from '~/utils/getDefaultSessionTimes.ts'
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

const startDateTime = shallowRef<Date>(new Date())
const endDateTime = shallowRef<Date>(new Date())

const isCreateMode = computed(() => !props.session)

const modalTitle = computed(() => (isCreateMode.value ? 'Add session' : 'Edit session'))

const validationErrors = computed(() => validateTimeRange(startDateTime.value, endDateTime.value))

const durationDisplay = computed(() => {
	if (validationErrors.value.length > 0) return '--:--:--'
	return formatDuration(calculateDuration(startDateTime.value, endDateTime.value))
})

const displayedErrors = computed(() => {
	const errors = [...validationErrors.value]
	if (props.saveError) {
		errors.push({ field: 'save', message: props.saveError })
	}
	return errors
})

const showValidationErrors = shallowRef(false)

function resetForm(): void {
	showValidationErrors.value = false

	if (props.session) {
		startDateTime.value = new Date(props.session.startTime)
		endDateTime.value = props.session.endTime
			? new Date(props.session.endTime)
			: new Date(props.session.startTime)
		return
	}

	const { startTime: defaultStart, endTime: defaultEnd } = getDefaultSessionTimes(props.defaultDate)
	startDateTime.value = defaultStart
	endDateTime.value = defaultEnd
}

function handleSave(): void {
	showValidationErrors.value = true

	if (validationErrors.value.length > 0) return

	emit('save', {
		startTime: startDateTime.value,
		endTime: endDateTime.value,
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
					<AppDateTimeInput
						v-model="startDateTime"
						date-aria-label="Start date"
						time-aria-label="Start time"
						size="sm"
						color="neutral"
						variant="subtle"
						:disabled="loading || (session?.isActive ?? false)"
					/>
				</UFormField>

				<UFormField
					label="End"
					name="end"
				>
					<AppDateTimeInput
						v-model="endDateTime"
						date-aria-label="End date"
						time-aria-label="End time"
						size="sm"
						color="neutral"
						variant="subtle"
						:disabled="loading"
					/>
				</UFormField>

				<div class="text-sm text-muted">
					Duration: <span class="font-mono text-default">{{ durationDisplay }}</span>
				</div>

				<UAlert
					v-if="showValidationErrors && displayedErrors.length > 0"
					color="error"
					variant="subtle"
					icon="i-lucide-circle-alert"
					:title="
						displayedErrors.length === 1
							? displayedErrors[0]?.message
							: 'Please fix the following issues'
					"
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
