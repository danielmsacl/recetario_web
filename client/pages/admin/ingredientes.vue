<template>
  <div class="container">
    <header class="admin-header">
      <button @click="volver" class="btn-volver">← Volver</button>
      <h1>🥬 Administrar Ingredientes</h1>
    </header>

    <div v-if="pending" class="loading">Cargando ingredientes...</div>
    <div v-else-if="error" class="error">Error: {{ error.message }}</div>
    
    <div v-else class="admin-ingredientes">
      <table class="tabla-ingredientes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ingrediente in ingredientes" :key="ingrediente.id">
            <td class="id-cell">{{ ingrediente.id }}</td>
            <td class="nombre-cell">{{ ingrediente.nombre }}</td>
            <td class="acciones">
              <button @click="abrirModalEditar(ingrediente)" class="btn-editar">✏️ Editar</button>
              <button @click="eliminarIngrediente(ingrediente.id, ingrediente.nombre)" class="btn-eliminar">🗑️ Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button @click="abrirModalCrear" class="btn-crear">+ Crear Nuevo Ingrediente</button>

    <!-- MODAL CREAR -->
    <div v-if="modalCrearAbierto" class="modal" @click.self="cerrarModalCrear">
      <div class="modal-content">
        <div class="modal-header">
          <h2>➕ Nuevo Ingrediente</h2>
          <button @click="cerrarModalCrear" class="btn-cerrar">×</button>
        </div>
        
        <form @submit.prevent="guardarNuevo" class="modal-form">
          <div class="form-group">
            <label>Nombre *</label>
            <input type="text" v-model="nuevoIngrediente.nombre" required autofocus />
          </div>
          
          <div class="modal-actions">
            <button type="submit" class="btn-guardar" :disabled="creando">
              {{ creando ? 'Creando...' : '✨ Crear Ingrediente' }}
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
          <h2>✏️ Editar Ingrediente</h2>
          <button @click="cerrarModalEditar" class="btn-cerrar">×</button>
        </div>
        
        <form @submit.prevent="guardarEdicion" class="modal-form">
          <div class="form-group">
            <label>Nombre *</label>
            <input type="text" v-model="ingredienteEditando.nombre" required autofocus />
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
import { API_URL } from '~/api'

const { data: ingredientes, pending, error, refresh } = await useFetch(`${API_URL}/api/ingredientes`)

const modalCrearAbierto = ref(false)
const creando = ref(false)
const nuevoIngrediente = ref({
  nombre: ''
})

const modalEditarAbierto = ref(false)
const guardando = ref(false)
const ingredienteEditando = ref({
  id: null,
  nombre: ''
})

const volver = () => {
  navigateTo('/principal')
}

const abrirModalCrear = () => {
  nuevoIngrediente.value = { nombre: '' }
  modalCrearAbierto.value = true
}

const cerrarModalCrear = () => {
  modalCrearAbierto.value = false
  creando.value = false
}

const getToken = () => {
  return localStorage.getItem('token')
}

const guardarNuevo = async () => {
  creando.value = true
  const token = getToken()
  
  try {
    const response = await fetch(`${API_URL}/api/ingredientes`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(nuevoIngrediente.value)
    })
    
    if (response.ok) {
      cerrarModalCrear()
      refresh()
      alert('✅ Ingrediente creado correctamente')
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

const abrirModalEditar = (ingrediente) => {
  ingredienteEditando.value = { ...ingrediente }
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
    const response = await fetch(`${API_URL}/api/ingredientes/${ingredienteEditando.value.id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nombre: ingredienteEditando.value.nombre
      })
    })
    
    if (response.ok) {
      cerrarModalEditar()
      refresh()
      alert('✅ Ingrediente actualizado correctamente')
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

const eliminarIngrediente = async (id, nombre) => {
  if (confirm(`¿Estás seguro de eliminar "${nombre}"?`)) {
    const token = getToken()
    
    try {
      const response = await fetch(`${API_URL}/api/ingredientes/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        alert(`✅ ${data.mensaje || 'Ingrediente eliminado correctamente'}`)
        refresh()
      } 
      else if (response.status === 409) {
        // Error: ingrediente en uso
        alert(`🚫 ${data.mensaje || 'No se puede eliminar el ingrediente porque está siendo usado en una o más recetas'}`)
      }
      else if (response.status === 404) {
        alert('❌ Ingrediente no encontrado')
      }
      else {
        alert('❌ Error al eliminar el ingrediente')
      }
      
    } catch (err) {
      console.error('Error:', err)
      alert('❌ Error de conexión con el servidor')
    }
  }
}
</script>

<style scoped>
@import '~/assets/css/admin_ingredientes.css';
</style>