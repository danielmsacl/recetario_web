<template>
  <div class="app-wrapper">
    <header class="header">
      <div class="container">
        <div class="header-content">
          <h1>🍽️ Recetas Extravagantes 🌶️💩</h1>
          <div class="user-info">
            <span class="user-name">👤 {{ usuarioActual.nombre }}</span>
            <span v-if="esDesarrollador" class="badge-dev">🔧 Desarrollador</span>
            <button @click="cerrarSesion" class="btn-logout">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <div class="hero">
          <h2 class="hero-title">Bienvenido, {{ usuarioActual.nombre }}!</h2>
          <p class="hero-subtitle">Descubre las combinaciones mas extravagantes de sabores y texturas</p>
          <button @click="irARecetas" class="btn-hero">
            Ver Recetario →
          </button>
        </div>

        <div v-if="esDesarrollador" class="dev-panel">
          <h3>🛠️ Panel de Desarrollador</h3>
          <div class="dev-actions">
            <button @click="irAdminRecetas" class="btn-dev">📋 Gestionar Recetas</button>
            <button @click="irAdminUsuarios" class="btn-dev">👥 Gestionar Usuarios</button>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <p>© 2026 Recetas Extravagantes | Hecho con ❤️ y el buen gusto</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import '~/assets/css/principal.css';
@import '~/assets/css/main.css';
</style>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { API_URL } from '~/api'

const usuarioActual = ref({ nombre: 'Invitado', email: '', rol: 'usuario' })

const esDesarrollador = computed(() => {
  return usuarioActual.value.rol === 'desarrollador' || usuarioActual.value.rol === 'admin'
})

onMounted(() => {
  const usuario = localStorage.getItem('usuario')
  if (usuario) {
    usuarioActual.value = JSON.parse(usuario)
  }
})

const irARecetas = () => {
  navigateTo('/recetas')
}

const cerrarSesion = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  navigateTo('/')
}

const irAdminRecetas = () => {
  navigateTo('/admin/recetas')
}

const irAdminUsuarios = () => {
  navigateTo('/admin/usuarios')
}
</script>