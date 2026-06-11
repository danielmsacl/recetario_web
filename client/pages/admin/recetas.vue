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
            <th>Preparación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="receta in recetas" :key="receta.id">
            <td>{{ receta.id }}</td>
            <td>{{ receta.titulo }}</td>
            <td class="preparacion-cell">{{ receta.preparacion.substring(0, 50) }}...</td>
            <td class="acciones">
              <button @click="abrirModalEditar(receta)" class="btn-editar">✏️ Editar</button>
              <button @click="eliminarReceta(receta.id)" class="btn-eliminar">🗑️ Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button @click="abrirModalCrear" class="btn-crear">+ Crear Nueva Receta</button>

    <div v-if="modalCrearAbierto" class="modal" @click.self="cerrarModalCrear">
      <div class="modal-content">
        <div class="modal-header">
          <h2>➕ Nueva Receta</h2>
          <button @click="cerrarModalCrear" class="btn-cerrar">×</button>
        </div>
        
        <form @submit.prevent="guardarNueva" class="modal-form">
          <div class="form-group">
            <label>Título</label>
            <input type="text" v-model="nuevaReceta.titulo" required />
          </div>
          
          <div class="form-group">
            <label>Preparación</label>
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

    <!-- MODAL DE EDITAR -->
    <div v-if="modalEditarAbierto" class="modal" @click.self="cerrarModalEditar">
      <div class="modal-content">
        <div class="modal-header">
          <h2>✏️ Editar Receta</h2>
          <button @click="cerrarModalEditar" class="btn-cerrar">×</button>
        </div>
        
        <form @submit.prevent="guardarEdicion" class="modal-form">
          <div class="form-group">
            <label>Título</label>
            <input type="text" v-model="recetaEditando.titulo" required />
          </div>
          
          <div class="form-group">
            <label>Preparación</label>
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
  url_imagen: ''
})

const modalEditarAbierto = ref(false)
const guardando = ref(false)
const recetaEditando = ref({
  id: null,
  titulo: '',
  preparacion: '',
  url_imagen: ''
})

const volver = () => {
  navigateTo('/principal')
}

const abrirModalCrear = () => {
  nuevaReceta.value = { titulo: '', preparacion: '', url_imagen: '' }
  modalCrearAbierto.value = true
}

const cerrarModalCrear = () => {
  modalCrearAbierto.value = false
  creando.value = false
}

const guardarNueva = async () => {
  creando.value = true
  try {
    const response = await fetch('http://localhost:3001/api/recetas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaReceta.value)
    })
    
    if (response.ok) {
      cerrarModalCrear()
      refresh()
      alert('✅ Receta creada correctamente')
    } else {
      alert('❌ Error al crear la receta')
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
  try {
    const response = await fetch(`http://localhost:3001/api/recetas/${recetaEditando.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: recetaEditando.value.titulo,
        preparacion: recetaEditando.value.preparacion,
        url_imagen: recetaEditando.value.url_imagen
      })
    })
    
    if (response.ok) {
      cerrarModalEditar()
      refresh()
      alert('✅ Receta actualizada correctamente')
    } else {
      alert('❌ Error al actualizar')
    }
  } catch (err) {
    alert('❌ Error de conexión')
  } finally {
    guardando.value = false
  }
}

const eliminarReceta = async (id) => {
  if (confirm('¿Estás seguro de eliminar esta receta?')) {
    await fetch(`http://localhost:3001/api/recetas/${id}`, { method: 'DELETE' })
    refresh()
  }
}
</script>

<style scoped>
@import '~/assets/css/admin_recetas.css';
</style>