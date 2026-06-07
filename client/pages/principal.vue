<template>
  <div>
    <!-- Header -->
    <header class="header">
      <div class="container">
        <h1>🍽️ Mi Recetario</h1>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="container">
      <div class="hero">
        <h2 class="hero-title">Bienvenido a Mi Recetario</h2>
        <p class="hero-subtitle">Descubre las mejores recetas caseras</p>
        <button @click="irARecetas" class="btn-hero">
          Ver Recetario →
        </button>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <p>© 2026 Mi Recetario | Hecho con ❤️ y buena comida</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
const irARecetas = () => {
  navigateTo('/recetas')
}
</script>