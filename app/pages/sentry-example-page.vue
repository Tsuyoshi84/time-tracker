<!--
This is just a very simple page with a button to throw an example error.
Feel free to delete this file.
-->

<script setup lang="ts">
import * as Sentry from '@sentry/nuxt'

/**
 * Custom error class for Sentry example errors
 */
class SentryExampleFrontendError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'SentryExampleFrontendError'
	}
}

const hasSentError = ref<boolean>(false)
const isConnected = ref<boolean>(true)

onMounted(async (): Promise<void> => {
	try {
		const result = await Sentry.diagnoseSdkConnectivity()
		isConnected.value = result !== 'sentry-unreachable'
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: For debug
		console.error(error)
		isConnected.value = false
	}
})

/**
 * Fetches Sentry data and throws a sample error
 */
async function getSentryData(): Promise<void> {
	await Sentry.startSpan(
		{
			name: 'Example Frontend Span',
			op: 'test',
		},
		async (): Promise<void> => {
			const res = await $fetch('/api/sentry-example-api', {
				method: 'GET',
				ignoreResponseError: true,
			}).catch(() => null)
			if (!res) {
				hasSentError.value = true
			}
		},
	)
	throw new SentryExampleFrontendError('This error is raised on the frontend of the example page.')
}
</script>

<template>
	<div>
		<main class="flex min-h-screen flex-col items-center justify-center gap-4 p-4 font-sans">
			<div class="flex-1" />
			<svg
				height="40"
				width="40"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M21.85 2.995a3.698 3.698 0 0 1 1.353 1.354l16.303 28.278a3.703 3.703 0 0 1-1.354 5.053 3.694 3.694 0 0 1-1.848.496h-3.828a31.149 31.149 0 0 0 0-3.09h3.815a.61.61 0 0 0 .537-.917L20.523 5.893a.61.61 0 0 0-1.057 0l-3.739 6.494a28.948 28.948 0 0 1 9.63 10.453 28.988 28.988 0 0 1 3.499 13.78v1.542h-9.852v-1.544a19.106 19.106 0 0 0-2.182-8.85 19.08 19.08 0 0 0-6.032-6.829l-1.85 3.208a15.377 15.377 0 0 1 6.382 12.484v1.542H3.696A3.694 3.694 0 0 1 0 34.473c0-.648.17-1.286.494-1.849l2.33-4.074a8.562 8.562 0 0 1 2.689 1.536L3.158 34.17a.611.611 0 0 0 .538.917h8.448a12.481 12.481 0 0 0-6.037-9.09l-1.344-.772 4.908-8.545 1.344.77a22.16 22.16 0 0 1 7.705 7.444 22.193 22.193 0 0 1 3.316 10.193h3.699a25.892 25.892 0 0 0-3.811-12.033 25.856 25.856 0 0 0-9.046-8.796l-1.344-.772 5.269-9.136a3.698 3.698 0 0 1 3.2-1.849c.648 0 1.285.17 1.847.495Z"
					fill="currentcolor"
				/>
			</svg>
			<h1 class="m-0 rounded bg-black/5 px-1 font-mono text-xl leading-tight dark:bg-white/5">
				sentry-example-page
			</h1>

			<p class="max-w-lg text-center text-lg leading-relaxed text-gray-600 dark:text-gray-400">
				Click the button below, and view the sample error on the Sentry
				<a
					target="_blank"
					href="https://tsuyoshi.sentry.io/issues/?project=4509727333089280"
					class="text-purple-600 underline hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
				>
					Issues Page
				</a>
				. For more details about setting up Sentry,
				<a
					target="_blank"
					href="https://docs.sentry.io/platforms/javascript/guides/nuxt/"
					class="text-purple-600 underline hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
				>
					read our docs
				</a>
				.
			</p>

			<button
				type="button"
				:disabled="!isConnected"
				class="mt-1 rounded-lg border-none bg-purple-700 p-0 text-white transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none"
				@click="getSentryData"
			>
				<span
					class="inline-block rounded-lg border border-purple-700 bg-purple-500 px-4 py-3 text-xl font-bold leading-none"
				>
					Throw Sample Error
				</span>
			</button>

			<p
				v-if="hasSentError"
				class="rounded-lg border border-green-500 bg-green-400 px-4 py-3 text-xl leading-none text-gray-900"
			>
				Sample error was sent to Sentry.
			</p>
			<div
				v-else-if="!isConnected"
				class="w-[500px] rounded-lg border border-red-800 bg-red-600 px-4 py-3 text-center text-white"
			>
				<p>
					It looks like network requests to Sentry are being blocked, which will prevent errors from
					being captured. Try disabling your ad-blocker to complete the test.
				</p>
			</div>
			<div
				v-else
				class="h-[46px]"
			/>

			<div class="flex-1" />
		</main>
	</div>
</template>
