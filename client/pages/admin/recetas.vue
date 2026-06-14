<template>
  <div class="container">
    <header class="admin-header">
      <button @click="volver" class="btn-volver">← Volver</button>
      <h1>📋 Administrar Recetas</h1>
    </header>

    <div v-if="pending" class="loading">Cargando recetas...</div>
    <div v-else-if="error" class="error">Error: {{ error.message }}</div>
    
    <div v-else class="admin-recetas">
      <table class="tabla-recetas">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Dificultad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="receta in recetas" :key="receta.id">
            <td>{{ receta.id }}</td>
            <td>{{ receta.titulo }}</td>
            <td class="dificultad-cell">
              <span :class="['dificultad-badge', getDificultadClass(receta.dificultad)]">
                {{ getDificultadIcon(receta.dificultad) }} {{ receta.dificultad || 'media' }}
              </span>
            </td>
            <td class="acciones">
              <button @click="abrirModalEditar(receta)" class="btn-editar">✏️ Editar</button>
              <button @click="eliminarReceta(receta.id)" class="btn-eliminar">🗑️ Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button @click="abrirModalCrear" class="btn-crear">+ Crear Nueva Receta</button>

    <!-- MODAL CREAR -->
    <div v-if="modalCrearAbierto" class="modal" @click.self="cerrarModalCrear">
      <div class="modal-content">
        <div class="modal-header">
          <h2>➕ Nueva Receta</h2>
          <button @click="cerrarModalCrear" class="btn-cerrar">×</button>
        </div>
        
        <form @submit.prevent="guardarNueva" class="modal-form">
          <div class="form-group">
            <label>Título *</label>
            <input type="text" v-model="nuevaReceta.titulo" required />
          </div>
          
          <div class="form-group">
            <label>Dificultad</label>
            <select v-model="nuevaReceta.dificultad" class="select-dificultad">
              <option value="fácil">😇 Fácil</option>
              <option value="media">😐 Media</option>
              <option value="difícil">👹 Difícil</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Preparación *</label>
            <textarea v-model="nuevaReceta.preparacion" rows="8" required></textarea>
          </div>
          
          <div class="form-group">
            <label>URL de la imagen</label>
            <input type="text" v-model="nuevaReceta.url_imagen" placeholder="http://localhost:3001/uploads/..." />
          </div>
          
          <div class="modal-actions">
            <button type="submit" class="btn-guardar" :disabled="creando">
              {{ creando ? 'Creando...' : '✨ Crear Receta' }}
            </button>
            <button type="button" @click="cerrarModalCrear" class="btn-cancelar">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL EDITAR -->
    <div v-if="modalEditarAbierto" class="modal" @click.self="cerrarModalEditar">
      <div class="modal-content modal-editar">
        <div class="modal-header">
          <h2>✏️ Editar Receta</h2>
          <button @click="cerrarModalEditar" class="btn-cerrar">×</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="guardarEdicion" class="modal-form">
            <div class="form-group">
              <label>Título *</label>
              <input type="text" v-model="recetaEditando.titulo" required />
            </div>
            
            <div class="form-group">
              <label>Dificultad</label>
              <select v-model="recetaEditando.dificultad" class="select-dificultad">
                <option value="fácil">😇 Fácil</option>
                <option value="media">😐 Media</option>
                <option value="difícil">👹 Difícil</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Preparación *</label>
              <textarea v-model="recetaEditando.preparacion" rows="8" required></textarea>
            </div>
            
            <div class="form-group">
              <label>URL de la imagen</label>
              <input type="text" v-model="recetaEditando.url_imagen" placeholder="http://localhost:3001/uploads/..." />
            </div>
          </form>
          
          <!-- ============================================ -->
          <!-- SECCIÓN DE INGREDIENTES -->
          <!-- ============================================ -->
          <div class="ingredientes-section">
            <h3>🥬 Ingredientes</h3>
            
            <!-- Lista de ingredientes actuales -->
            <div class="ingredientes-list">
              <div v-for="item in ingredientesReceta" :key="item.id" class="ingrediente-item">
                <span class="ingrediente-nombre">{{ item.Ingrediente?.nombre }}</span>
                <div class="ingrediente-cantidad">
                  <input 
                    type="number" 
                    v-model="item.cantidad" 
                    class="input-cantidad"
                    step="0.01"
                    @change="actualizarCantidad(item)"
                  >
                  <select v-model="item.unidad" class="select-unidad" @change="actualizarCantidad(item)">
                    <option value="u">u</option>
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="l">l</option>
                    <option value="ml">ml</option>
                    <option value="taza">taza</option>
                    <option value="cda">cda</option>
                    <option value="cdta">cdta</option>
                  </select>
                </div>
                <button @click="eliminarIngredienteReceta(item.id)" class="btn-eliminar-ing" title="Eliminar">
                  🗑️
                </button>
              </div>
              <div v-if="ingredientesReceta.length === 0" class="sin-ingredientes">
                No hay ingredientes agregados
              </div>
            </div>
            
            <!-- Agregar nuevo ingrediente -->
            <div class="agregar-ingrediente">
              <div class="ingrediente-select">
                <input 
                  type="text"
                  v-model="busquedaIngrediente"
                  placeholder="🔍 Buscar ingrediente..."
                  class="input-busqueda-ing"
                  @input="filtrarIngredientes"
                >
                <select v-model="nuevoIngredienteId" class="select-ingrediente" size="5" v-if="ingredientesFiltrados.length > 0">
                  <option v-for="ing in ingredientesFiltrados" :key="ing.id" :value="ing.id">
                    {{ ing.nombre }}
                  </option>
                </select>
                <div v-else-if="busquedaIngrediente" class="sin-resultados">
                  No se encontró "{{ busquedaIngrediente }}"
                </div>
              </div>
              <div class="ingrediente-cantidad-nueva">
                <input 
                  type="number" 
                  v-model="nuevaCantidad" 
                  class="input-cantidad"
                  placeholder="Cantidad"
                  step="0.01"
                >
                <select v-model="nuevaUnidad" class="select-unidad">
                  <option value="u">u</option>
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="l">l</option>
                  <option value="ml">ml</option>
                  <option value="taza">taza</option>
                  <option value="cda">cda</option>
                  <option value="cdta">cdta</option>
                </select>
              </div>
              <button @click="agregarIngredienteReceta" class="btn-agregar-ing" :disabled="!nuevoIngredienteId || !nuevaCantidad">
                + Agregar
              </button>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="guardarEdicion" class="btn-guardar" :disabled="guardando">
            {{ guardando ? 'Guardando...' : '💾 Guardar Cambios' }}
          </button>
          <button @click="cerrarModalEditar" class="btn-cancelar">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { API_URL } from '~/api'

const { data: recetas, pending, error, refresh } = await useFetch(`${API_URL}/api/recetas`)

const modalCrearAbierto = ref(false)
const creando = ref(false)
const nuevaReceta = ref({
  titulo: '',
  preparacion: '',
  url_imagen: '',
  dificultad: 'media'
})

const modalEditarAbierto = ref(false)
const guardando = ref(false)
const recetaEditando = ref({
  id: null,
  titulo: '',
  preparacion: '',
  url_imagen: '',
  dificultad: 'media'
})

// Variables para ingredientes
const ingredientesReceta = ref([])
const listaTodosIngredientes = ref([])
const ingredientesFiltrados = ref([])
const busquedaIngrediente = ref('')
const nuevoIngredienteId = ref('')
const nuevaCantidad = ref('')
const nuevaUnidad = ref('u')

const volver = () => {
  navigateTo('/principal')
}

const abrirModalCrear = () => {
  nuevaReceta.value = { titulo: '', preparacion: '', url_imagen: '', dificultad: 'media' }
  modalCrearAbierto.value = true
}

const cerrarModalCrear = () => {
  modalCrearAbierto.value = false
  creando.value = false
}

const getToken = () => {
  return localStorage.getItem('token')
}

const guardarNueva = async () => {
  creando.value = true
  const token = getToken()
  
  try {
    const response = await fetch(`${API_URL}/api/recetas`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(nuevaReceta.value)
    })
    
    if (response.ok) {
      cerrarModalCrear()
      refresh()
      alert('✅ Receta creada correctamente')
    } else {
      const error = await response.json()
      alert('❌ Error: ' + (error.message || 'Error al crear'))
    }
  } catch (err) {
    alert('❌ Error de conexión')
  } finally {
    creando.value = false
  }
}

// Cargar ingredientes de la receta
const cargarIngredientesReceta = async (recetaId) => {
  try {
    const res = await fetch(`${API_URL}/api/recetas/${recetaId}/ingredientes`)
    ingredientesReceta.value = await res.json()
  } catch (error) {
    console.error('Error cargando ingredientes:', error)
  }
}

// Cargar todos los ingredientes para el select
const cargarTodosIngredientes = async () => {
  try {
    const res = await fetch(`${API_URL}/api/ingredientes`)
    listaTodosIngredientes.value = await res.json()
    ingredientesFiltrados.value = listaTodosIngredientes.value
  } catch (error) {
    console.error('Error cargando ingredientes:', error)
  }
}

// Filtrar ingredientes por búsqueda
const filtrarIngredientes = () => {
  if (!busquedaIngrediente.value.trim()) {
    ingredientesFiltrados.value = listaTodosIngredientes.value
  } else {
    const busqueda = busquedaIngrediente.value.toLowerCase()
    ingredientesFiltrados.value = listaTodosIngredientes.value.filter(ing =>
      ing.nombre.toLowerCase().includes(busqueda)
    )
  }
}

// Agregar ingrediente a la receta
const agregarIngredienteReceta = async () => {
  if (!nuevoIngredienteId.value || !nuevaCantidad.value) {
    alert('Selecciona un ingrediente y una cantidad')
    return
  }
  
  const token = getToken()
  
  try {
    const res = await fetch(`${API_URL}/api/recetas/${recetaEditando.value.id}/ingredientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ingrediente_id: nuevoIngredienteId.value,
        cantidad: parseFloat(nuevaCantidad.value),
        unidad: nuevaUnidad.value
      })
    })
    
    if (res.ok) {
      nuevoIngredienteId.value = ''
      nuevaCantidad.value = ''
      nuevaUnidad.value = 'u'
      busquedaIngrediente.value = ''
      await cargarIngredientesReceta(recetaEditando.value.id)
      await cargarTodosIngredientes()
    } else {
      const error = await res.json()
      alert('❌ Error: ' + (error.message || 'Error al agregar'))
    }
  } catch (error) {
    alert('❌ Error de conexión')
  }
}

// Actualizar cantidad de ingrediente
const actualizarCantidad = async (item) => {
  const token = getToken()
  
  try {
    await fetch(`${API_URL}/api/receta-ingredientes/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        cantidad: item.cantidad,
        unidad: item.unidad
      })
    })
  } catch (error) {
    console.error('Error actualizando cantidad:', error)
  }
}

// Eliminar ingrediente de la receta
const eliminarIngredienteReceta = async (id) => {
  if (!confirm('¿Eliminar este ingrediente de la receta?')) return
  
  const token = getToken()
  
  try {
    await fetch(`${API_URL}/api/receta-ingredientes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    await cargarIngredientesReceta(recetaEditando.value.id)
  } catch (error) {
    alert('❌ Error al eliminar')
  }
}

const abrirModalEditar = async (receta) => {
  recetaEditando.value = { ...receta }
  modalEditarAbierto.value = true
  await cargarIngredientesReceta(receta.id)
  await cargarTodosIngredientes()
}

const cerrarModalEditar = () => {
  modalEditarAbierto.value = false
  guardando.value = false
  ingredientesReceta.value = []
  busquedaIngrediente.value = ''
  nuevoIngredienteId.value = ''
  nuevaCantidad.value = ''
}

const guardarEdicion = async () => {
  guardando.value = true
  const token = getToken()
  
  try {
    const response = await fetch(`${API_URL}/api/recetas/${recetaEditando.value.id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        titulo: recetaEditando.value.titulo,
        preparacion: recetaEditando.value.preparacion,
        url_imagen: recetaEditando.value.url_imagen,
        dificultad: recetaEditando.value.dificultad
      })
    })
    
    if (response.ok) {
      cerrarModalEditar()
      refresh()
      alert('✅ Receta actualizada correctamente')
    } else {
      const errorData = await response.json()
      alert('❌ Error: ' + (errorData.message || 'Error al actualizar'))
    }
  } catch (err) {
    alert('❌ Error de conexión')
  } finally {
    guardando.value = false
  }
}

const eliminarReceta = async (id) => {
  if (confirm('¿Estás seguro de eliminar esta receta?')) {
    const token = getToken()
    
    await fetch(`${API_URL}/api/recetas/${id}`, { 
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    refresh()
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

const getDificultadClass = (dificultad) => {
  switch (dificultad) {
    case 'fácil': return 'dificultad-facil'
    case 'media': return 'dificultad-media'
    case 'difícil': return 'dificultad-dificil'
    default: return ''
  }
}
</script>

<style scoped>
@import '~/assets/css/admin_recetas.css';

/* ============================================ */
/* ESTILOS PARA INGREDIENTES */
/* ============================================ */
.ingredientes-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #e67e22;
}

.ingredientes-section h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.ingredientes-list {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 15px;
  max-height: 250px;
  overflow-y: auto;
}

.ingrediente-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px;
  border-bottom: 1px solid #ddd;
}

.ingrediente-item:last-child {
  border-bottom: none;
}

.ingrediente-nombre {
  flex: 2;
  font-weight: 500;
  color: #2c3e50;
}

.ingrediente-cantidad {
  display: flex;
  gap: 5px;
  align-items: center;
}

.input-cantidad {
  width: 80px;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
}

.select-unidad {
  width: 70px;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.btn-eliminar-ing {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.btn-eliminar-ing:hover {
  opacity: 1;
}

.sin-ingredientes {
  text-align: center;
  color: #6c757d;
  padding: 15px;
}

.agregar-ingrediente {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: flex-start;
}

.ingrediente-select {
  flex: 2;
}

.input-busqueda-ing {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 5px;
}

.select-ingrediente {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-height: 150px;
  overflow-y: auto;
}

.select-ingrediente option {
  padding: 5px;
  cursor: pointer;
}

.select-ingrediente option:hover {
  background: #e67e22;
  color: white;
}

.sin-resultados {
  padding: 10px;
  text-align: center;
  color: #e74c3c;
  font-size: 0.8rem;
}

.ingrediente-cantidad-nueva {
  display: flex;
  gap: 5px;
  align-items: center;
}

.btn-agregar-ing {
  background: #27ae60;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
  white-space: nowrap;
}

.btn-agregar-ing:hover:not(:disabled) {
  background: #219a52;
}

.btn-agregar-ing:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-editar {
  max-width: 700px;
  width: 90%;
}

.modal-body {
  max-height: 60vh;
  overflow-y: auto;
  padding: 20px;
}

.modal-footer {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  padding: 15px 20px;
  border-top: 1px solid #ddd;
  background: #f8f9fa;
  border-radius: 0 0 20px 20px;
}
</style>