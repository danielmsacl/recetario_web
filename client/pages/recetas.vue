<template>
  <div class="app-wrapper">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <div class="header-content">
          <button @click="volver" class="btn-volver">← Volver</button>
          <h1>🍽️ Recetas Extravagantes 🌶️💩</h1>
        </div>
      </div>
    </header>

    <main class="recetas-main">
      <div class="container">
        <div class="filtros-section">
          <div class="busqueda">
            <input 
              type="text" 
              v-model="busqueda" 
              placeholder="🔍 Buscar receta por nombre..."
              class="input-busqueda"
            >
          </div>
          <div class="filtro-dificultad">
            <label>Filtrar por dificultad:</label>
            <select v-model="filtroDificultad" class="select-dificultad">
              <option value="todas">Todas</option>
              <option value="fácil">😇 Fácil</option>
              <option value="media">😐 Media</option>
              <option value="difícil">👹 Difícil</option>
            </select>
          </div>
        </div>

        <div v-if="pending" class="loading">
          ⏳ Cargando deliciosas recetas...
        </div>

        <div v-else-if="error" class="error">
          ❌ Error: {{ error.message }}
        </div>

        <div v-else class="recetas-grid">
          <div v-for="receta in recetasFiltradas" :key="receta.id" class="receta-card">
            <!-- Imagen -->
            <div class="receta-imagen-container">
              <img 
                v-if="receta.url_imagen"
                :src="receta.url_imagen" 
                :alt="receta.titulo"
                class="receta-imagen"
              >
              <div v-else class="receta-imagen-placeholder">
                🍳
              </div>
            </div>

            <div class="receta-contenido">
              <h3 class="receta-titulo">{{ receta.titulo }}</h3>
              <div class="receta-dificultad">
                <span class="dificultad-icon">{{ getDificultadIcon(receta.dificultad) }}</span>
                <span class="dificultad-texto">{{ receta.dificultad || 'media' }}</span>
              </div>
              <p class="receta-preparacion">{{ truncarTexto(receta.preparacion, 80) }}</p>
              <button @click="abrirModalDetalle(receta)" class="btn-ver">
                Ver receta completa →
              </button>
            </div>
          </div>
        </div>

        <div v-if="!pending && !error && recetasFiltradas.length === 0" class="sin-resultados">
          <p>No se encontraron recetas con esos criterios</p>
          <button @click="limpiarFiltros" class="btn-limpiar">Limpiar filtros</button>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <p>© 2026 Recetas Extravagantes | Hecho con ❤️ y el buen gusto</p>
      </div>
    </footer>

    <!-- MODAL DETALLE RECETA -->
    <div v-if="modalDetalleAbierto" class="modal-overlay" @click.self="cerrarModalDetalle">
      <div class="modal-contenido">
        <div class="modal-header">
          <h2>📖 {{ recetaDetalle.titulo }}</h2>
          <button @click="cerrarModalDetalle" class="modal-cerrar">×</button>
        </div>
        
        <div class="modal-body">
          <div class="detalle-imagen" v-if="recetaDetalle.url_imagen">
            <img :src="recetaDetalle.url_imagen" :alt="recetaDetalle.titulo">
          </div>
          
          <div class="detalle-dificultad">
            <span class="detalle-icon">{{ getDificultadIcon(recetaDetalle.dificultad) }}</span>
            <span>Dificultad: {{ recetaDetalle.dificultad || 'media' }}</span>
          </div>
          
          <div class="detalle-preparacion">
            <h3>📝 Preparación:</h3>
            <p>{{ recetaDetalle.preparacion }}</p>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="cerrarModalDetalle" class="btn-cerrar-modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { data: recetas, pending, error } = await useFetch('http://localhost:3001/api/recetas')

const busqueda = ref('')
const filtroDificultad = ref('todas')
const modalDetalleAbierto = ref(false)
const recetaDetalle = ref({})

// Recetas filtradas
const recetasFiltradas = computed(() => {
  let resultado = recetas.value || []
  
  if (busqueda.value.trim()) {
    resultado = resultado.filter(r => 
      r.titulo.toLowerCase().includes(busqueda.value.toLowerCase())
    )
  }
  
  if (filtroDificultad.value !== 'todas') {
    resultado = resultado.filter(r => r.dificultad === filtroDificultad.value)
  }
  
  return resultado
})

// Obtener icono según dificultad
const getDificultadIcon = (dificultad) => {
  switch (dificultad) {
    case 'fácil': return '😇'
    case 'media': return '😐'
    case 'difícil': return '👹'
    default: return '⭐'
  }
}

// Truncar texto
const truncarTexto = (texto, longitud) => {
  if (!texto) return ''
  if (texto.length <= longitud) return texto
  return texto.substring(0, longitud) + '...'
}

// Limpiar filtros
const limpiarFiltros = () => {
  busqueda.value = ''
  filtroDificultad.value = 'todas'
}

const abrirModalDetalle = (receta) => {
  recetaDetalle.value = receta
  modalDetalleAbierto.value = true
}

const cerrarModalDetalle = () => {
  modalDetalleAbierto.value = false
  recetaDetalle.value = {}
}

const volver = () => {
  navigateTo('/principal')
}
</script>

<style scoped>
@import '~/assets/css/recetas.css';

.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.recetas-main {
  flex: 1;
}

/* Estilos del modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-contenido {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 700px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 2px solid #e67e22;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
}

.modal-cerrar {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
}

.modal-cerrar:hover {
  color: #e74c3c;
}

.modal-body {
  padding: 20px;
}

.detalle-imagen {
  text-align: center;
  margin-bottom: 20px;
}

.detalle-imagen img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 15px;
  object-fit: cover;
}

.detalle-dificultad {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f0f0f0;
  padding: 8px 16px;
  border-radius: 30px;
  margin-bottom: 20px;
}

.detalle-icon {
  font-size: 1.2rem;
}

.detalle-preparacion h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.detalle-preparacion p {
  color: #555;
  line-height: 1.6;
  white-space: pre-wrap;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #ddd;
  text-align: center;
  position: sticky;
  bottom: 0;
  background: white;
}

.btn-cerrar-modal {
  background: #e67e22;
  color: white;
  border: none;
  padding: 10px 30px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.btn-cerrar-modal:hover {
  background: #d35400;
}
</style>  