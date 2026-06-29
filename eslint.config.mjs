// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
	rules: {
		'no-self-assign': 'off', // Checked by Biome
		'vue/html-self-closing': [
			'error',
			{
				html: {
					void: 'any',
				},
			},
		],
	},
})
