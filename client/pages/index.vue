<template>
  <div class="login-body">
    <div :class="['container', { 'right-panel-active': isRightPanelActive }]" id="container">
      <!-- Sign Up Form -->
      <div class="form-container sign-up-container">
        <form @submit.prevent="handleRegistro">
          <h1>Crear cuenta</h1>
          <span></span>
          <input type="text" v-model="registro.nombre" placeholder="Nombre" required />
          <input type="email" v-model="registro.email" placeholder="Email" required />
          <input type="password" v-model="registro.password" placeholder="Contraseña" required />
          <button type="submit" :disabled="cargandoRegistro">
            {{ cargandoRegistro ? 'Registrando...' : 'Registrarse' }}
          </button>
          <p v-if="errorRegistro" class="error-message">{{ errorRegistro }}</p>
        </form>
      </div>

      <!-- Sign In Form -->
      <div class="form-container sign-in-container">
        <form @submit.prevent="handleLogin">
          <h1>Ingresar</h1>
          <span></span>
          <input type="email" v-model="login.email" placeholder="Email" required />
          <input type="password" v-model="login.password" placeholder="Contraseña" required />
          <a href="#" @click.prevent="irARecuperar">¿Olvidaste tu contraseña?</a>
          <button type="submit" :disabled="cargandoLogin">
            {{ cargandoLogin ? 'Ingresando...' : 'Ingresar' }}
          </button>
          <button type="button" @click="entrarSinCuenta" class="btn-guest">
            Entrar sin cuenta
          </button>
          <p v-if="errorLogin" class="error-message">{{ errorLogin }}</p>
        </form>
      </div>

      <!-- Overlay -->
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>¡Bienvenido de vuelta!</h1>
            <p>Para mantener la conexión, inicia sesión con tus datos personales</p>
            <button class="ghost" @click="isRightPanelActive = false">Ingresar</button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1>BIENVENIDO A</h1>
            <h1>🍽️ Recetas Extravagantes</h1>
            <h1>🌶️💩</h1>
            <p></p>
            <button class="ghost" @click="isRightPanelActive = true">Registrarse</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const API_URL = 'https://recetarioweb-production.up.railway.app'

const isRightPanelActive = ref(false)

const login = ref({
  email: '',
  password: ''
})
const cargandoLogin = ref(false)
const errorLogin = ref('')

const registro = ref({
  nombre: '',
  email: '',
  password: ''
})
const cargandoRegistro = ref(false)
const errorRegistro = ref('')

const handleLogin = async () => {
  cargandoLogin.value = true
  errorLogin.value = ''
  
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: login.value.email,
        password: login.value.password
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
      navigateTo('/principal')
    } else {
      errorLogin.value = data.error || data.message || 'Credenciales inválidas'
    }
  } catch (err) {
    errorLogin.value = 'Error de conexión con el servidor'
  } finally {
    cargandoLogin.value = false
  }
}

const handleRegistro = async () => {
  cargandoRegistro.value = true
  errorRegistro.value = ''
  
  try {
    const response = await fetch(`${API_URL}/api/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: registro.value.nombre,
        email: registro.value.email,
        password: registro.value.password
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      isRightPanelActive.value = false
      registro.value = { nombre: '', email: '', password: '' }
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.')
    } else {
      errorRegistro.value = data.error || data.message || 'Error al registrarse'
    }
  } catch (err) {
    errorRegistro.value = 'Error de conexión con el servidor'
  } finally {
    cargandoRegistro.value = false
  }
}

const entrarSinCuenta = () => {
  localStorage.setItem('token', 'guest')
  localStorage.setItem('usuario', JSON.stringify({ 
    id: 0,
    nombre: 'Invitado', 
    email: 'invitado@recetario.com',
    rol: 'invitado'
  }))
  navigateTo('/principal')
}

const irARecuperar = () => {
  navigateTo('/recuperar_pass')
}
</script>

<style scoped>
@import '~/assets/css/login.css';
</style>