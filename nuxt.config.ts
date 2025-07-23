// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'@nuxt/eslint',
		'@nuxtjs/tailwindcss',
		'@vueuse/nuxt',
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
})
