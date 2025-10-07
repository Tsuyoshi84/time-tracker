<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

// Global meta tags
useSeoMeta({
	title: 'Time Tracker - Freelance Time Management',
	description:
		'Professional time tracking application for freelance engineers with flexible timer system and detailed analytics',
	ogTitle: 'Time Tracker - Freelance Time Management',
	ogDescription:
		'Professional time tracking application for freelance engineers with flexible timer system and detailed analytics',
	ogType: 'website',
	twitterCard: 'summary_large_image',
})

// Global head configuration
useHead({
	htmlAttrs: {
		lang: 'en',
	},
	meta: [
		{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
		{ name: 'format-detection', content: 'telephone=no' },
		{ name: 'theme-color', content: '#3b82f6' },
	],
	link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
})

const items: NavigationMenuItem[][] = [
	[
		{
			label: 'Dashboard',
			icon: 'i-lucide-clock',
			to: '/',
		},
		{
			label: 'Weekly',
			icon: 'i-lucide-calendar',
			to: '/weekly',
		},
	],
]
</script>

<template>
	<UApp>
		<UHeader title="Time Tracker">
			<template #title>
				<Timer class="w-8 h-8 text-primary" />
				<h1 class="text-2xl font-bold text-primary">Time Tracker</h1>
			</template>

			<template #right>
				<nav class="flex items-center space-x-2">
					<UNavigationMenu
						color="neutral"
						variant="link"
						:items="items"
						class="w-full"
					/>
					<UColorModeButton />
				</nav>
			</template>
		</UHeader>
		<UMain class="py-4">
			<NuxtPage />
		</UMain>
	</UApp>
</template>

<style>
html {
	font-family: 'Inter', system-ui, sans-serif;
}

body {
	margin: 0;
	padding: 0;
	min-height: 100vh;
}

* {
	box-sizing: border-box;
}
</style>
