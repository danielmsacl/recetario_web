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
      <div class="modal-content">
        <div class="modal-header">
          <h2>✏️ Editar Receta</h2>
          <button @click="cerrarModalEditar" class="btn-cerrar">×</button>
        </div>
        
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
          
          <div class="modal-actions">
            <button type="submit" class="btn-guardar" :disabled="guardando">
              {{ guardando ? 'Guardando...' : '💾 Guardar Cambios' }}
            </button>
            <button type="button" @click="cerrarModalEditar" class="btn-cancelar">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const { data: recetas, pending, error, refresh } = await useFetch('http://localhost:3001/api/recetas')

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

// Obtener token del localStorage
const getToken = () => {
  return localStorage.getItem('token')
}

const guardarNueva = async () => {
  creando.value = true
  const token = localStorage.getItem('token')  // ← Obtener token
  
  try {
    const response = await fetch('http://localhost:3001/api/recetas', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // ← Agregar token
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

const abrirModalEditar = (receta) => {
  recetaEditando.value = { ...receta }
  modalEditarAbierto.value = true
}

const cerrarModalEditar = () => {
  modalEditarAbierto.value = false
  guardando.value = false
}

const guardarEdicion = async () => {
  guardando.value = true
  const token = getToken()
  
  try {
    const response = await fetch(`http://localhost:3001/api/recetas/${recetaEditando.value.id}`, {
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
    
    await fetch(`http://localhost:3001/api/recetas/${id}`, { 
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    refresh()
  }
}

// Funciones para mostrar dificultad en la tabla
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
</style>