<script setup lang="ts">
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
		'data-theme': 'light',
	},
	meta: [
		{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
		{ name: 'format-detection', content: 'telephone=no' },
		{ name: 'theme-color', content: '#3b82f6' },
	],
	link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
html {
  font-family: "Inter", system-ui, sans-serif;
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
