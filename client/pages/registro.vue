<template>
  <div class="login-container">
    <div class="login-card">
      <h1>🍽️ Recetas Extravagantes 🌶️💩 </h1>
      <h2>Crear Cuenta</h2>
      
      <form @submit.prevent="handleRegistro">
        <div class="form-group">
          <label>Nombre</label>
          <input type="text" v-model="nombre" required placeholder="Tu nombre">
        </div>
        
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" required placeholder="correo@ejemplo.com">
        </div>
        
        <div class="form-group">
          <label>Contraseña</label>
          <input type="password" v-model="password" required placeholder="******">
        </div>
        
        <button type="submit" class="btn-login" :disabled="cargando">
          {{ cargando ? 'Registrando...' : 'Registrarse' }}
        </button>
        
        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
      
      <p class="registro-link">
        ¿Ya tienes cuenta? 
        <a href="#" @click.prevent="irALogin">Inicia sesión aquí</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const nombre = ref('')
const email = ref('')
const password = ref('')
const cargando = ref(false)
const error = ref('')

const handleRegistro = async () => {
  cargando.value = true
  error.value = ''
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombre.value,
        email: email.value,
        password: password.value
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      navigateTo('/')
    } else {
      error.value = data.error || 'Error al registrarse'
    }
  } catch (err) {
    error.value = 'Error de conexión con el servidor'
  } finally {
    cargando.value = false
  }
}

const irALogin = () => {
  navigateTo('/')
}
</script>