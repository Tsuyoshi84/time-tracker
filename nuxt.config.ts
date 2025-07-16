// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'@nuxt/eslint',
		'@nuxtjs/tailwindcss',
		[
			'@nuxt/fonts',
			{
				families: [{ name: 'Inter', provider: 'google', weights: [300, 400, 500, 600, 700] }],
			},
		],
	],
	ssr: false,
	devtools: { enabled: true },
	css: ['~/assets/css/main.css'],
	srcDir: 'app/',
	future: {
		compatibilityVersion: 4,
	},
	compatibilityDate: '2025-05-15',
	eslint: {
		config: {
			nuxt: {
				sortConfigKeys: true,
			},
		},
	},
})
