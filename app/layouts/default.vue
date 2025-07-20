<script setup lang="ts">
import { Calendar, Clock, Timer } from 'lucide-vue-next'
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
						<ul class="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box">
							<li>
								<NuxtLink
									active-class="menu-active"
									to="/"
								>
									<Clock class="w-4 h-4" />
									Dashboard
								</NuxtLink>
							</li>
							<li>
								<NuxtLink
									active-class="menu-active"
									to="/weekly"
								>
									<Calendar class="w-4 h-4" />
									Weekly
								</NuxtLink>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</header>

		<!-- Main Content -->
		<main class="container mx-auto px-4 py-8">
			<slot />
		</main>
	</div>
</template>
