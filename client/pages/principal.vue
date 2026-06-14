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
        <!-- RECETA DEL DÍA -->
        <div v-if="recetaDelDia" class="receta-dia-card">
          <div class="receta-dia-imagen">
            <img 
              v-if="recetaDelDia.url_imagen"
              :src="recetaDelDia.url_imagen" 
              :alt="recetaDelDia.titulo"
            >
            <div v-else class="receta-dia-placeholder">🍳</div>
          </div>
          <div class="receta-dia-info">
            <div class="receta-dia-etiqueta">🌟 Receta del Día 🌟</div>
            <h3>{{ recetaDelDia.titulo }}</h3>
            <p>{{ truncarTexto(recetaDelDia.preparacion, 100) }}</p>
            <button @click="abrirModalDetalle(recetaDelDia)" class="btn-ver-dia">
              Ver receta completa →
            </button>
          </div>
        </div>

        <!-- Hero Section -->
        <div class="hero-compacto">
          <h2 class="hero-title-compacto">Bienvenido, {{ usuarioActual.nombre }}!</h2>
          <button @click="irARecetas" class="btn-hero-compacto">
            📖 Ver Recetario
          </button>
        </div>

        <!-- Panel de Desarrollador -->
        <div v-if="esDesarrollador" class="dev-panel">
          <h3>🛠️ Panel de Desarrollador</h3>
          <div class="dev-actions">
            <button @click="irAdminRecetas" class="btn-dev">📋 Gestionar Recetas</button>
            <button @click="irAdminUsuarios" class="btn-dev">👥 Gestionar Usuarios</button>
          </div>
          
          <div class="dev-section">
            <h4>🌟 Configurar Receta del Día</h4>
            <select v-model="recetaDiaId" @change="cambiarRecetaDia" class="select-receta-dia">
              <option value="">-- Selecciona una receta --</option>
              <option v-for="rec in listaRecetas" :key="rec.id" :value="rec.id">
                {{ rec.titulo }}
              </option>
            </select>
            <p class="dev-info">La receta seleccionada se mostrará arriba</p>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <p>© 2026 Recetas Extravagantes | Hecho con ❤️ y el buen gusto</p>
      </div>
    </footer>

    <!-- MODAL DE DETALLE DE RECETA -->
    <div v-if="modalDetalleAbierto" class="modal" @click.self="cerrarModalDetalle">
      <div class="modal-content modal-detalle">
        <div class="modal-header">
          <h2>📖 {{ recetaDetalle.titulo }}</h2>
          <button @click="cerrarModalDetalle" class="btn-cerrar">×</button>
        </div>
        
        <div class="modal-body">
          <div class="detalle-imagen" v-if="recetaDetalle.url_imagen">
            <img :src="recetaDetalle.url_imagen" :alt="recetaDetalle.titulo">
          </div>
          
          <div class="detalle-dificultad">
            <span class="detalle-icon">{{ getDificultadIcon(recetaDetalle.dificultad) }}</span>
            <span class="detalle-texto">Dificultad: {{ recetaDetalle.dificultad || 'media' }}</span>
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

<style scoped>
@import '~/assets/css/principal.css';
@import '~/assets/css/main.css';

/* ============================================ */
/* HERO COMPACTO */
/* ============================================ */
.hero-compacto {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 20px;
  margin: 40px 0;
}

.hero-title-compacto {
  font-size: 2rem;
  color: var(--secondary);
  margin-bottom: 20px;
}

.btn-hero-compacto {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  border: none;
  padding: 12px 35px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.btn-hero-compacto:hover {
  transform: scale(1.05);
}

/* ============================================ */
/* RECETA DEL DÍA */
/* ============================================ */
.receta-dia-card {
  display: flex;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.receta-dia-imagen {
  width: 200px;
  background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
  display: flex;
  align-items: center;
  justify-content: center;
}

.receta-dia-imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.receta-dia-placeholder {
  font-size: 3rem;
  padding: 20px;
}

.receta-dia-info {
  flex: 1;
  padding: 20px;
}

.receta-dia-etiqueta {
  background: linear-gradient(135deg, #e67e22, #d35400);
  color: white;
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.receta-dia-info h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.receta-dia-info p {
  color: #6c757d;
  margin-bottom: 15px;
  line-height: 1.4;
}

.btn-ver-dia {
  background: #e67e22;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.2s;
}

.btn-ver-dia:hover {
  background: #d35400;
}

/* ============================================ */
/* PANEL DE DESARROLLADOR - SECCIÓN EXTRA */
/* ============================================ */
.dev-section {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.dev-section h4 {
  margin-bottom: 10px;
  font-size: 1rem;
}

.select-receta-dia {
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: none;
  margin-bottom: 8px;
  background: white;
  color: #2c3e50;
}

.dev-info {
  font-size: 0.7rem;
  opacity: 0.7;
  margin: 0;
}

/* ============================================ */
/* MODAL DE DETALLE DE RECETA */
/* ============================================ */
.modal {
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

.modal-content.modal-detalle {
  max-width: 700px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  background: white;
  border-radius: 20px;
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

.btn-cerrar {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
}

.btn-cerrar:hover {
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

.detalle-texto {
  font-weight: 500;
  color: #e67e22;
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

/* ============================================ */
/* RESPONSIVE */
/* ============================================ */
@media (max-width: 768px) {
  .hero-title-compacto {
    font-size: 1.5rem;
  }
  
  .receta-dia-card {
    flex-direction: column;
  }
  
  .receta-dia-imagen {
    width: 100%;
    height: 150px;
  }
}
</style>

<script setup>
import { ref, onMounted, computed } from 'vue'

const API_URL = 'https://recetarioweb-production.up.railway.app'

const usuarioActual = ref({ nombre: 'Invitado', email: '', rol: 'usuario' })
const recetaDiaId = ref('')
const recetaDelDia = ref(null)
const listaRecetas = ref([])

// Modal de detalle
const modalDetalleAbierto = ref(false)
const recetaDetalle = ref({})

const esDesarrollador = computed(() => {
  return usuarioActual.value.rol === 'desarrollador' || usuarioActual.value.rol === 'admin'
})

const cargarListaRecetas = async () => {
  try {
    const res = await fetch(`${API_URL}/api/recetas`)
    listaRecetas.value = await res.json()
  } catch (error) {
    console.error('Error cargando recetas:', error)
  }
}

const cargarRecetaDelDia = async () => {
  const idGuardado = localStorage.getItem('receta_dia_id')
  if (!idGuardado) return
  
  try {
    const res = await fetch(`${API_URL}/api/recetas/${idGuardado}`)
    recetaDelDia.value = await res.json()
    recetaDiaId.value = idGuardado
  } catch (error) {
    console.error('Error cargando receta del día:', error)
  }
}

const cambiarRecetaDia = async () => {
  if (!recetaDiaId.value) {
    recetaDelDia.value = null
    localStorage.removeItem('receta_dia_id')
    return
  }
  
  try {
    const res = await fetch(`${API_URL}/api/recetas/${recetaDiaId.value}`)
    recetaDelDia.value = await res.json()
    localStorage.setItem('receta_dia_id', recetaDiaId.value)
  } catch (error) {
    console.error('Error cambiando receta del día:', error)
  }
}

const abrirModalDetalle = (receta) => {
  recetaDetalle.value = receta
  modalDetalleAbierto.value = true
}

const cerrarModalDetalle = () => {
  modalDetalleAbierto.value = false
  recetaDetalle.value = {}
}

const getDificultadIcon = (dificultad) => {
  switch (dificultad) {
    case 'fácil': return '😇'
    case 'media': return '😐'
    case 'difícil': return '👹'
    default: return '⭐'
  }
}

const truncarTexto = (texto, longitud) => {
  if (!texto) return ''
  if (texto.length <= longitud) return texto
  return texto.substring(0, longitud) + '...'
}

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

onMounted(() => {
  const usuario = localStorage.getItem('usuario')
  if (usuario) {
    usuarioActual.value = JSON.parse(usuario)
  }
  cargarListaRecetas()
  cargarRecetaDelDia()
})
</script>