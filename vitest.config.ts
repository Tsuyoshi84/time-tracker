import { resolve } from 'node:path'
import { defineVitestProject } from '@nuxt/test-utils/config'
import { defineConfig } from 'vitest/config'

const unitTestPaths = [
	'shared/**/*.spec.ts',
	'app/utils/**/*.spec.ts',
	'app/domain/**/*.spec.ts',
	'server/utils/**/*.spec.ts',
]

export default defineConfig({
	test: {
		projects: [
			{
				resolve: {
					alias: {
						'~~': resolve(__dirname, './'),
						'~': resolve(__dirname, './app'),
						'#shared': resolve(__dirname, './shared'),
					},
				},
				test: {
					name: 'unit',
					include: unitTestPaths,
					environment: 'happy-dom',
				},
			},
			await defineVitestProject({
				test: {
					name: 'nuxt',
					include: ['app/**/*.spec.ts', 'server/**/*.spec.ts'],
					exclude: [...unitTestPaths, 'sentry.client.config.ts'],
					includeSource: ['**/*.{ts,vue}'],
					globals: true,
					environment: 'nuxt',
					environmentOptions: {
						nuxt: {
							domEnvironment: 'happy-dom',
						},
					},
					setupFiles: ['test/setup.ts'],
				},
			}),
		],
	},
})