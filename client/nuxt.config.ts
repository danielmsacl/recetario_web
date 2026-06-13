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
    // Redirige todas las peticiones que comiencen con /api
    '/api/**': {
      proxy: 'https://web-production-ccf1.up.railway.app/api/**'
    },
    // Redirige todas las peticiones de archivos subidos
    '/uploads/**': {
      proxy: 'https://web-production-ccf1.up.railway.app/uploads/**'
    }
  }
})