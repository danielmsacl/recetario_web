// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/google-fonts',
    '@nuxt/image'
  ],
  // Configuración para redirigir peticiones de la API en producción
  routeRules: {
    '/api/**': {
      proxy: 'https://TU_BACKEND_RAILWAY.up.railway.app/api/**'
    },
    '/uploads/**': {
      proxy: 'https://TU_BACKEND_RAILWAY.up.railway.app/uploads/**'
    }
  }
})