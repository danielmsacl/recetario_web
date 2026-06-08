<template>
  <div class="login-container">
    <div class="login-card">
      <h1>🍽️ Recetas Extravagantes 🌶️💩 </h1>
      <h2>Iniciar Sesión</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" required placeholder="correo@ejemplo.com">
        </div>
        
        <div class="form-group">
          <label>Contraseña</label>
          <input type="password" v-model="password" required placeholder="********">
        </div>
        
        <button type="submit" class="btn-login" :disabled="cargando">
          {{ cargando ? 'Ingresando...' : 'Ingresar' }}
        </button>
        
        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
      
      <button @click="entrarSinCuenta" class="btn-guest">
        Entrar sin cuenta
      </button>
      
      <p class="registro-link">
        ¿No tienes cuenta? 
        <a href="#" @click.prevent="irARegistro">Regístrate aquí</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const cargando = ref(false)
const error = ref('')

const handleLogin = async () => {
  cargando.value = true
  error.value = ''
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
      navigateTo('/principal')
    } else {
      error.value = data.error || 'Error al iniciar sesión'
    }
  } catch (err) {
    error.value = 'Error de conexión con el servidor'
  } finally {
    cargando.value = false
  }
}

const entrarSinCuenta = () => {
  // Guardar un token de invitado
  localStorage.setItem('token', 'guest')
  localStorage.setItem('usuario', JSON.stringify({ nombre: 'Invitado', email: 'guest@recetario.com' }))
  navigateTo('/principal')
}

const irARegistro = () => {
  navigateTo('/registro')
}
</script>


