<template>
  <div class="container">
    <header class="admin-header">
      <button @click="volver" class="btn-volver">← Volver</button>
      <h1>👥 Administrar Usuarios</h1>
    </header>

    <div v-if="pending" class="loading">Cargando usuarios...</div>
    <div v-else-if="error" class="error">Error: {{ error.message }}</div>
    
    <div v-else class="admin-usuarios">
      <table class="tabla-usuarios">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Fecha Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario.id">
            <td class="id-cell">{{ usuario.id }}</td>
            <td class="nombre-cell">{{ usuario.nombre }}</td>
            <td class="email-cell">{{ usuario.email }}</td>
            <td class="rol-cell">
              <span :class="['rol-badge', getRolClass(usuario.rol)]">
                {{ getRolIcon(usuario.rol) }} {{ usuario.rol || 'usuario' }}
              </span>
            </td>
            <td class="fecha-cell">{{ formatearFecha(usuario.created_at) }}</td>
            <td class="acciones">
              <button @click="abrirModalEditar(usuario)" class="btn-editar">✏️ Editar</button>
              <button @click="eliminarUsuario(usuario.id)" class="btn-eliminar">🗑️ Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button @click="abrirModalCrear" class="btn-crear">+ Crear Nuevo Usuario</button>

    <!-- MODAL CREAR -->
    <div v-if="modalCrearAbierto" class="modal" @click.self="cerrarModalCrear">
      <div class="modal-content">
        <div class="modal-header">
          <h2>➕ Nuevo Usuario</h2>
          <button @click="cerrarModalCrear" class="btn-cerrar">×</button>
        </div>
        
        <form @submit.prevent="guardarNuevo" class="modal-form">
          <div class="form-group">
            <label>Nombre *</label>
            <input type="text" v-model="nuevoUsuario.nombre" required />
          </div>
          
          <div class="form-group">
            <label>Email *</label>
            <input type="email" v-model="nuevoUsuario.email" required />
          </div>
          
          <div class="form-group">
            <label>Contraseña *</label>
            <input type="password" v-model="nuevoUsuario.password" required />
          </div>
          
          <div class="form-group">
            <label>Rol</label>
            <select v-model="nuevoUsuario.rol" class="select-rol">
              <option value="usuario">👤 Usuario</option>
              <option value="desarrollador">🔧 Desarrollador</option>
            </select>
          </div>
          
          <div class="modal-actions">
            <button type="submit" class="btn-guardar" :disabled="creando">
              {{ creando ? 'Creando...' : '✨ Crear Usuario' }}
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
          <h2>✏️ Editar Usuario</h2>
          <button @click="cerrarModalEditar" class="btn-cerrar">×</button>
        </div>
        
        <form @submit.prevent="guardarEdicion" class="modal-form">
          <div class="form-group">
            <label>Nombre *</label>
            <input type="text" v-model="usuarioEditando.nombre" required />
          </div>
          
          <div class="form-group">
            <label>Email *</label>
            <input type="email" v-model="usuarioEditando.email" required />
          </div>
          
          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" v-model="usuarioEditando.password" placeholder="Dejar vacío para no cambiar" />
          </div>
          
          <div class="form-group">
            <label>Rol</label>
            <select v-model="usuarioEditando.rol" class="select-rol">
              <option value="usuario">👤 Usuario</option>
              <option value="desarrollador">🔧 Desarrollador</option>
            </select>
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

const { data: usuarios, pending, error, refresh } = await useFetch(`${API_URL}/api/usuarios`, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})

const modalCrearAbierto = ref(false)
const creando = ref(false)
const nuevoUsuario = ref({
  nombre: '',
  email: '',
  password: '',
  rol: 'usuario'
})

const modalEditarAbierto = ref(false)
const guardando = ref(false)
const usuarioEditando = ref({
  id: null,
  nombre: '',
  email: '',
  password: '',
  rol: 'usuario'
})

const volver = () => {
  navigateTo('/principal')
}

const abrirModalCrear = () => {
  nuevoUsuario.value = { nombre: '', email: '', password: '', rol: 'usuario' }
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
    const response = await fetch(`${API_URL}/api/auth/registro`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nombre: nuevoUsuario.value.nombre,
        email: nuevoUsuario.value.email,
        password: nuevoUsuario.value.password,
        rol: nuevoUsuario.value.rol
      })
    })
    
    if (response.ok) {
      cerrarModalCrear()
      refresh()
      alert('✅ Usuario creado correctamente')
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

const abrirModalEditar = (usuario) => {
  usuarioEditando.value = { ...usuario, password: '' }
  modalEditarAbierto.value = true
}

const cerrarModalEditar = () => {
  modalEditarAbierto.value = false
  guardando.value = false
}

const guardarEdicion = async () => {
  guardando.value = true
  const token = getToken()
  
  const dataToSend = {
    nombre: usuarioEditando.value.nombre,
    email: usuarioEditando.value.email,
    rol: usuarioEditando.value.rol
  }
  
  if (usuarioEditando.value.password) {
    dataToSend.password = usuarioEditando.value.password
  }
  
  try {
    const response = await fetch(`${API_URL}/api/usuarios/${usuarioEditando.value.id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dataToSend)
    })
    
    if (response.ok) {
      cerrarModalEditar()
      refresh()
      alert('✅ Usuario actualizado correctamente')
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

const eliminarUsuario = async (id) => {
  if (confirm('¿Estás seguro de eliminar este usuario?')) {
    const token = getToken()
    
    await fetch(`${API_URL}/api/usuarios/${id}`, { 
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    refresh()
  }
}

// Funciones para mostrar rol en la tabla
const getRolIcon = (rol) => {
  switch (rol) {
    case 'desarrollador': return '🔧'
    case 'admin': return '👑'
    default: return '👤'
  }
}

const getRolClass = (rol) => {
  switch (rol) {
    case 'desarrollador': return 'rol-desarrollador'
    case 'admin': return 'rol-admin'
    default: return 'rol-usuario'
  }
}

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES')
}
</script>

<style scoped>
@import '~/assets/css/admin_usuarios.css';
</style> 