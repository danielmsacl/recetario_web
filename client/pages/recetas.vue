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

              <!-- INGREDIENTES -->
              <div v-if="ingredientesMap[receta.id] && ingredientesMap[receta.id].length" class="receta-ingredientes">
                <div class="ingredientes-titulo">🥬 Ingredientes:</div>
                <div class="ingredientes-lista">
                  <div v-for="item in ingredientesMap[receta.id]" :key="item.id" class="ingrediente-item">
                    <span class="ingrediente-nombre">{{ item.Ingrediente?.nombre }}</span>
                    <span class="ingrediente-cantidad">
                      {{ item.cantidad }} {{ item.unidad || 'u' }}
                    </span>
                  </div>
                </div>
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
          
          <!-- INGREDIENTES EN EL MODAL -->
          <div v-if="ingredientesMap[recetaDetalle.id] && ingredientesMap[recetaDetalle.id].length" class="detalle-ingredientes">
            <h3>🥬 Ingredientes:</h3>
            <ul class="ingredientes-lista-detalle">
              <li v-for="item in ingredientesMap[recetaDetalle.id]" :key="item.id">
                {{ item.cantidad }} {{ item.unidad || 'u' }} de {{ item.Ingrediente?.nombre }}
              </li>
            </ul>
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
import { ref, computed, onMounted } from 'vue'
import { API_URL } from '~/api'

const { data: recetas, pending, error } = await useFetch(`${API_URL}/api/recetas`)

const busqueda = ref('')
const filtroDificultad = ref('todas')
const modalDetalleAbierto = ref(false)
const recetaDetalle = ref({})
const ingredientesMap = ref({})

// Cargar ingredientes de una receta
const cargarIngredientes = async (recetaId) => {
  try {
    const res = await fetch(`${API_URL}/api/recetas/${recetaId}/ingredientes`)
    const data = await res.json()
    ingredientesMap.value[recetaId] = data
  } catch (error) {
    console.error('Error cargando ingredientes:', error)
    ingredientesMap.value[recetaId] = []
  }
}

// Cargar ingredientes de todas las recetas
const cargarTodosIngredientes = async () => {
  if (!recetas.value) return
  
  for (const receta of recetas.value) {
    await cargarIngredientes(receta.id)
  }
}

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

// Cargar ingredientes cuando las recetas estén listas
onMounted(async () => {
  await cargarTodosIngredientes()
})
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

/* Estilos para ingredientes en la tarjeta */
.receta-ingredientes {
  margin: 10px 0;
  padding: 8px;
  background: #9cbee4;
  border-radius: 16px;
}

.ingredientes-titulo {
  font-size: 1.0rem;
  font-weight: bolder;
  color: #000000;
  margin-bottom: 5px;
}

.ingredientes-lista {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.ingrediente-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgb(227, 253, 193);
  padding: 2px 8px;
  border-radius: 15px;
  font-size: 1.0rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.ingrediente-nombre {
  color: #0a0e11;
}

.ingrediente-cantidad {
  color: #e67e22;
  font-weight: 560;
}

/* Estilos para ingredientes en el modal */
.detalle-ingredientes {
  margin: 15px 0;
  padding: 15px;
  background: #a3b1c0;
  border-radius: 15px;
  font-weight: bold;
}

.detalle-ingredientes h3 {
  color: #000000;
  margin-bottom: 10px;
  font-size: 1,5rem;
}

.ingredientes-lista-detalle {
  list-style: none;
  padding: 0;
}

.ingredientes-lista-detalle li {
  padding: 5px 0;
  border-bottom: 1px solid #1f5e17;
  color: #000000;
}

.ingredientes-lista-detalle li:last-child {
  border-bottom: none;
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
  background: rgb(238, 247, 240);
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
  background: rgb(163, 218, 218);
  z-index: 10;
}

.modal-header h2 {
  margin: 0;
  color: #000000;
}

.modal-cerrar {
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
  color: #423030;
  transition: color 0.2s;
}

.modal-cerrar:hover {
  color: #990f00;
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
  border-radius: 5px;
  object-fit: cover;
  border: 4px solid rgba(31, 48, 33, 0.397);
}

.detalle-dificultad {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: white;
  background: #4e4a4a;
  padding: 8px 16px;
  border-radius: 30px;
  margin-bottom: 20px;
}

.detalle-icon {
  font-size: 1.4rem;
}

.detalle-preparacion h3 {
  color: #ffffff;
  margin-bottom: 10px;
}

.detalle-preparacion p {
  color: #000000;
  line-height: 1.6;
  font-weight: bolder;
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