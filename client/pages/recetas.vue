<template>
  <div class="recetas-page">
    <div class="app-wrapper">
      <!-- Header -->
      <header class="header">
        <div class="container">
          <div class="header-content">
            <button @click="volver" class="btn-volver">
              ← Volver
            </button>
            <h1>🍽️ Recetas Extravagantes 🌶️💩</h1>
          </div>
        </div>
      </header>

      <!-- Contenido principal -->
      <main class="main-content">
        <div class="container">
          <h2 class="section-title">📖 Nuestras Recetas</h2>
          
          <div v-if="pending" class="loading">
            ⏳ Cargando deliciosas recetas...
          </div>
          
          <div v-else-if="error" class="error">
            ❌ Error al cargar recetas: {{ error.message }}
          </div>
          
          <div v-else class="recetas-grid">
            <div v-for="receta in recetas" :key="receta.id" class="receta-card">
              <!-- Imagen -->
              <img 
                v-if="receta.url_imagen"
                :src="receta.url_imagen" 
                :alt="receta.titulo"
                class="receta-imagen"
              >
              <div v-else class="receta-imagen-placeholder">
                🍳 Sin imagen
              </div>
              
              <!-- Contenido -->
              <div class="receta-card-content">
                <h3 class="receta-titulo">{{ receta.titulo }}</h3>
                <p class="receta-preparacion">{{ receta.preparacion }}</p>
                <button @click="verReceta(receta.id)" class="btn-ver">
                  Ver receta completa →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <p>© 2026 Recetas Extravagantes | Hecho con ❤️ y el buen gusto</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
const { data: recetas, pending, error } = await useFetch('http://localhost:3001/api/recetas')

const verReceta = (id) => {
  console.log('Ver receta:', id)
}

const volver = () => {
  navigateTo('/principal')
}
</script>

<style scoped>
  @import '~/assets/css/recetas.css';
</style>