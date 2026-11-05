// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  future: {
    compatibilityVersion: 4, 
  },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt'
  ],
})