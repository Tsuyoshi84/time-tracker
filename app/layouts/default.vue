<script setup lang="ts">
import { Timer } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <!-- Header -->
    <header class="bg-base-100 shadow-sm border-b border-base-300">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <Timer class="w-8 h-8 text-primary" />
            <h1 class="text-2xl font-bold text-primary">Time Tracker</h1>
          </div>
          <nav class="flex space-x-4">
            <NuxtLink
              to="/"
              class="btn btn-sm btn-ghost"
              :class="{ 'btn-active': $route.path === '/' }"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink
              to="/weekly"
              class="btn btn-sm btn-ghost"
              :class="{ 'btn-active': $route.path === '/weekly' }"
            >
              Weekly
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-base-100 border-t border-base-300 mt-auto">
      <div class="container mx-auto px-4 py-4">
        <div class="text-center text-sm text-gray-500">
          <p>Freelance Time Tracker - Built with Nuxt 3 & daisyUI</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.btn-active {
  @apply bg-primary text-primary-content;
}
</style>
