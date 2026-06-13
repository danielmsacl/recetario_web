// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['nuxt-icons', '@nuxtjs/tailwindcss', '@nuxt/ui'],
  routeRules: {
    '/api/**': {
      proxy: 'https://web-production-ccf1.up.railway.app/api/**'
    },
    '/uploads/**': {
      proxy: 'https://web-production-ccf1.up.railway.app/uploads/**'
    }
  }
})