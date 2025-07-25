import * as Sentry from '@sentry/nuxt'

// Only run `init` when process.env.SENTRY_DSN is available.
if (process.env.SENTRY_DSN) {
	Sentry.init({
		dsn: process.env.SENTRY_DSN,
		// Setting this option to true will print useful information to the console while you're setting up Sentry.
		debug: false,
	})
}
