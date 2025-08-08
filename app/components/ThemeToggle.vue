<script setup lang="ts">
/**
 * ThemeToggle
 *
 * A button to toggle between light and dark themes.
 * - Uses Lucide icons (Sun/Moon) for visual indication
 * - Accessible label updates based on current state
 */

import { Moon, Sun } from 'lucide-vue-next'
import { computed } from 'vue'
import { useTheme } from '../composables/useTheme.ts'

const { isDark, toggleTheme } = useTheme()

const label = computed<string>(() =>
	isDark.value ? 'Switch to light theme' : 'Switch to dark theme',
)
</script>

<template>
	<button
		class="btn btn-ghost btn-circle"
		:type="'button'"
		:aria-label="label"
		:title="label"
		@click="toggleTheme"
	>
		<Sun
			v-if="!isDark"
			class="w-5 h-5"
		/>
		<Moon
			v-else
			class="w-5 h-5"
		/>
	</button>
</template>
