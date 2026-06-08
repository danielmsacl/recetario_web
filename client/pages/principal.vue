<template>
  <div>
    <!-- Header -->
    <header class="header">
      <div class="container">
        <div class="header-content">
          <h1>🍽️ Recetas del Sur</h1>
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

    <!-- Contenido principal -->
    <main class="container">
      <div class="hero">
        <h2 class="hero-title">Bienvenido, {{ usuarioActual.nombre }}!</h2>
        <p class="hero-subtitle">Descubre las mejores recetas caseras del sur</p>
        <button @click="irARecetas" class="btn-hero">
          Ver Recetario →
        </button>
      </div>

      <!-- Panel de Desarrollador (solo visible para desarrolladores) -->
      <div v-if="esDesarrollador" class="dev-panel">
        <h3>🛠️ Panel de Desarrollador</h3>
        <div class="dev-actions">
          <button @click="irAdminRecetas" class="btn-dev">📋 Gestionar Recetas</button>
          <button @click="irAdminUsuarios" class="btn-dev">👥 Gestionar Usuarios</button>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <p>© 2026 Recetas del Sur | Hecho con ❤️ y buena comida</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const usuarioActual = ref({ nombre: 'Invitado', email: '', rol: 'usuario' })

// Computed para saber si es desarrollador
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

// Funciones del panel de desarrollador
const irAdminRecetas = () => {
  navigateTo('/admin/recetas')
}

const irAdminUsuarios = () => {
  navigateTo('/admin/usuarios')
}
</script>