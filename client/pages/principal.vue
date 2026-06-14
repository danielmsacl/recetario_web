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

        <!-- ============================================ -->
        <!-- RECETA DEL DÍA -->
        <!-- ============================================ -->
        <div class="receta-del-dia-container">
          <div class="receta-card-grande">
            <div class="receta-imagen-grande">
              <img 
                v-if="recetaDelDia?.url_imagen"
                :src="recetaDelDia.url_imagen" 
                :alt="recetaDelDia.titulo"
              >
              <div v-else class="receta-imagen-placeholder-grande">
                🍳
              </div>
              <div v-if="esDesarrollador" class="admin-badge-edit">
                <button @click="abrirModalEditar" class="btn-editar-admin">
                  ✏️ Cambiar receta
                </button>
              </div>
            </div>
            
            <div class="receta-info-grande">
              <div class="receta-etiqueta">
                <span>🌟 Receta del Día 🌟</span>
              </div>
              <h3>{{ recetaDelDia?.titulo || 'Cargando...' }}</h3>
              <div class="receta-dificultad">
                <span class="dificultad-icon">{{ getDificultadIcon(recetaDelDia?.dificultad) }}</span>
                <span>{{ recetaDelDia?.dificultad || 'media' }}</span>
              </div>
              <p class="receta-preparacion-resumen">{{ truncarTexto(recetaDelDia?.preparacion, 100) }}</p>
              <button @click="verRecetaCompleta" class="btn-ver-completa">
                Ver receta completa →
              </button>
            </div>
          </div>
        </div>

        <!-- Panel de Desarrollador -->
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

    <!-- Modal de edición (solo admin) -->
    <div v-if="modalEditarAbierto && esDesarrollador" class="modal" @click.self="cerrarModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>🍽️ Cambiar Receta del Día</h2>
          <button @click="cerrarModal" class="btn-cerrar">×</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Seleccionar receta:</label>
            <select v-model="recetaSeleccionadaId" class="select-receta">
              <option value="">-- Selecciona una receta --</option>
              <option v-for="rec in listaRecetas" :key="rec.id" :value="rec.id">
                {{ rec.titulo }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Fecha (opcional, por defecto hoy):</label>
            <input type="date" v-model="fechaSeleccionada" />
          </div>
          
          <div class="modal-actions">
            <button @click="guardarRecetaDelDia" class="btn-guardar" :disabled="guardando">
              {{ guardando ? 'Guardando...' : '💾 Asignar receta' }}
            </button>
            <button @click="cerrarModal" class="btn-cancelar">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '~/assets/css/principal.css';
@import '~/assets/css/main.css';

.receta-del-dia-container {
  margin: 40px 0;
}

.receta-card-grande {
  display: flex;
  background: white;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.receta-card-grande:hover {
  transform: translateY(-5px);
}

.receta-imagen-grande {
  flex: 1;
  min-width: 300px;
  position: relative;
  background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
  display: flex;
  align-items: center;
  justify-content: center;
}

.receta-imagen-grande img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.receta-imagen-placeholder-grande {
  font-size: 6rem;
  padding: 50px;
}

.admin-badge-edit {
  position: absolute;
  top: 15px;
  right: 15px;
}

.btn-editar-admin {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.2s;
}

.btn-editar-admin:hover {
  background: #e67e22;
}

.receta-info-grande {
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.receta-etiqueta {
  margin-bottom: 15px;
}

.receta-etiqueta span {
  background: linear-gradient(135deg, #e67e22, #d35400);
  color: white;
  padding: 5px 15px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: bold;
  display: inline-block;
}

.receta-info-grande h3 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 15px;
}

.receta-dificultad {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f0f0f0;
  padding: 6px 12px;
  border-radius: 20px;
  margin-bottom: 20px;
  font-size: 0.8rem;
}

.receta-preparacion-resumen {
  color: #6c757d;
  line-height: 1.5;
  margin-bottom: 20px;
}

.btn-ver-completa {
  background: linear-gradient(135deg, #e67e22, #d35400);
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  transition: transform 0.2s;
  width: fit-content;
}

.btn-ver-completa:hover {
  transform: scale(1.05);
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  padding: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e67e22;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.3rem;
}

.btn-cerrar {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #999;
}

.btn-cerrar:hover {
  color: #e74c3c;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #2c3e50;
}

.select-receta {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.btn-guardar {
  background: #27ae60;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.btn-guardar:disabled {
  opacity: 0.7;
}

.btn-cancelar {
  background: #95a5a6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

@media (max-width: 768px) {
  .receta-card-grande {
    flex-direction: column;
  }
  
  .receta-imagen-grande {
    min-width: auto;
    height: 200px;
  }
  
  .receta-info-grande h3 {
    font-size: 1.5rem;
  }
}
</style>

<script setup>
import { ref, onMounted, computed } from 'vue'

const API_URL = 'https://recetarioweb-production.up.railway.app'

const usuarioActual = ref({ nombre: 'Invitado', email: '', rol: 'usuario' })
const recetaDelDia = ref(null)
const listaRecetas = ref([])
const modalEditarAbierto = ref(false)
const recetaSeleccionadaId = ref('')
const fechaSeleccionada = ref('')
const guardando = ref(false)

const esDesarrollador = computed(() => {
  return usuarioActual.value.rol === 'desarrollador' || usuarioActual.value.rol === 'admin'
})

// Cargar receta del día
const cargarRecetaDelDia = async () => {
  try {
    const res = await fetch(`${API_URL}/api/receta-del-dia`)
    const data = await res.json()
    recetaDelDia.value = data.receta
  } catch (error) {
    console.error('Error cargando receta del día:', error)
  }
}

// Cargar lista de recetas (para admin)
const cargarListaRecetas = async () => {
  if (!esDesarrollador.value) return
  try {
    const res = await fetch(`${API_URL}/api/recetas-para-combobox`)
    listaRecetas.value = await res.json()
  } catch (error) {
    console.error('Error cargando recetas:', error)
  }
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

const verRecetaCompleta = () => {
  if (recetaDelDia.value?.id) {
    navigateTo(`/recetas/${recetaDelDia.value.id}`)
  }
}

const abrirModalEditar = () => {
  recetaSeleccionadaId.value = recetaDelDia.value?.id || ''
  fechaSeleccionada.value = ''
  modalEditarAbierto.value = true
}

const cerrarModal = () => {
  modalEditarAbierto.value = false
}

const guardarRecetaDelDia = async () => {
  if (!recetaSeleccionadaId.value) {
    alert('❌ Selecciona una receta')
    return
  }
  
  guardando.value = true
  const token = localStorage.getItem('token')
  
  try {
    const res = await fetch(`${API_URL}/api/receta-del-dia`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        receta_id: recetaSeleccionadaId.value,
        fecha: fechaSeleccionada.value || undefined
      })
    })
    
    if (res.ok) {
      alert('✅ Receta del día actualizada')
      cerrarModal()
      cargarRecetaDelDia()
    } else {
      const error = await res.json()
      alert('❌ Error: ' + (error.message || 'Error al actualizar'))
    }
  } catch (error) {
    alert('❌ Error de conexión')
  } finally {
    guardando.value = false
  }
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
  cargarRecetaDelDia()
  if (esDesarrollador.value) {
    cargarListaRecetas()
  }
})
</script>