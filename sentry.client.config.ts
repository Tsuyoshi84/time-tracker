import * as Sentry from '@sentry/nuxt'
import { useRuntimeConfig } from 'nuxt/app'

const config = useRuntimeConfig()

interface SentryConfig {
	dsn?: string
	release?: string
}

Sentry.init({
	dsn: (config.public.sentry as SentryConfig).dsn,
	release: (config.public.sentry as SentryConfig).release,
	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,
	enableLogs: true,
	integrations: [
		Sentry.consoleLoggingIntegration({
			levels: ['log', 'info', 'warn', 'error'],
		}),
	],
})
