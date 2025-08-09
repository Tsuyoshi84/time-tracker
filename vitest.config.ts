import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [vue()],
	test: {
		environment: 'happy-dom',
		globals: true,
	},
	resolve: {
		alias: {
			'~': resolve(__dirname, './app'),
			'@': resolve(__dirname, './app'),
		},
	},
})
