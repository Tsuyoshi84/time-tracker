// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  future: {
    compatibilityVersion: 4,
  },
  srcDir: "app/",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint"],
  ssr: false,
})
