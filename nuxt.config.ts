/** biome-ignore-all lint/suspicious/noConsole: It's okay to use console in nuxt.config.ts */

if (!process.env.SENTRY_AUTH_TOKEN) {
	console.log('SENTRY_AUTH_TOKEN is not provided. It will not send sourcemaps to Sentry')
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'@nuxt/eslint',
		'@nuxtjs/tailwindcss',
		'@vue-macros/nuxt',
		'@vueuse/nuxt',
		[
			'@nuxt/fonts',
			{
				families: [{ name: 'Inter', provider: 'google', weights: [300, 400, 500, 600, 700] }],
			},
		],
		'@sentry/nuxt/module',
		'@nuxt/test-utils/module',
	],

	ssr: false,
	devtools: { enabled: true },
	css: ['~/assets/css/main.css'],

	runtimeConfig: {
		public: {
			sentry: {
				dsn: process.env.SENTRY_DSN,
				release: process.env.SENTRY_RELEASE ?? process.env.VERCEL_GIT_COMMIT_SHA,
			},
		},
	},
	srcDir: 'app/',

	sourcemap: {
		client: 'hidden',
	},
	compatibilityDate: '2025-05-15',

	typescript: {
		tsConfig: {
			compilerOptions: {
				allowImportingTsExtensions: true,
				allowUnreachableCode: false,
				erasableSyntaxOnly: true,
				forceConsistentCasingInFileNames: true,
				noErrorTruncation: true,
				noFallthroughCasesInSwitch: true,
				noImplicitOverride: true,
				noImplicitReturns: true,
				noUncheckedIndexedAccess: true,
				noUnusedLocals: false,
				noUnusedParameters: false,
				useUnknownInCatchVariables: true,
				strict: true,
			},
		},
	},

	eslint: {
		config: {
			nuxt: {
				sortConfigKeys: true,
			},
		},
	},

	sentry: {
		...(process.env.SENTRY_AUTH_TOKEN && {
			sourceMapsUploadOptions: {
				org: 'tsuyoshi',
				project: 'time-tracker',
				authToken: process.env.SENTRY_AUTH_TOKEN,
			},
		}),

		autoInjectServerSentry: 'top-level-import',
	},
})
