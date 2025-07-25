import * as Sentry from '@sentry/nuxt'
import { useRuntimeConfig } from 'nuxt/app'

const config = useRuntimeConfig()

Sentry.init({
	dsn: (config.public.sentry as { dsn: string }).dsn,
	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,
})
