<template>
  <div class="recuperar-container">
    <div class="recuperar-card">
      <button @click="volver" class="btn-volver">← Volver</button>
      <h1>🔐 Recuperar Contraseña</h1>
      <p>Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña</p>
      
      <form @submit.prevent="solicitarReset">
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" placeholder="tu@email.com" required />
        </div>
        
        <button type="submit" :disabled="cargando">
          {{ cargando ? 'Enviando...' : 'Enviar enlace' }}
        </button>
        
        <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
        <p v-if="errorMsg" class="error-message">{{ errorMsg }}</p>
        
        <!-- Mostrar progreso de redirección -->
        <div v-if="redirigiendo" class="redirigiendo">
          <div class="spinner"></div>
          <p>✅ Token generado correctamente</p>
          <p>Redirigiendo en {{ contador }} segundos...</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const API_URL = 'https://recetarioweb-production.up.railway.app'

const email = ref('')
const cargando = ref(false)
const mensaje = ref('')
const errorMsg = ref('')
const redirigiendo = ref(false)
const contador = ref(3)
let intervalo = null

const solicitarReset = async () => {
  cargando.value = true
  mensaje.value = ''
  errorMsg.value = ''
  redirigiendo.value = false
  
  if (intervalo) clearInterval(intervalo)
  
  try {
    const response = await fetch(`${API_URL}/api/auth/solicitar-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      mensaje.value = data.mensaje
      
      // Redirigir usando reset_url del backend
      if (data.reset_url) {
        redirigiendo.value = true
        contador.value = 3
        
        intervalo = setInterval(() => {
          contador.value--
          if (contador.value <= 0) {
            clearInterval(intervalo)
            window.location.href = data.reset_url
          }
        }, 1000)
      }
    } else {
      errorMsg.value = data.error || 'Error al enviar la solicitud'
    }
  } catch (err) {
    errorMsg.value = 'Error de conexión con el servidor'
  } finally {
    cargando.value = false
  }
}

const volver = () => {
  if (intervalo) clearInterval(intervalo)
  navigateTo('/')
}
</script>

<style scoped>
.recuperar-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4a0e4e 0%, #2d0a2e 100%);
}

.recuperar-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  position: relative;
}

.btn-volver {
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  color: #e67e22;
  cursor: pointer;
  font-size: 1rem;
}

.recuperar-card h1 {
  color: #e67e22;
  margin-bottom: 10px;
  text-align: center;
}

.recuperar-card p {
  color: #666;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #2c3e50;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #e67e22;
}

button[type="submit"] {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #e67e22, #d35400);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

button[type="submit"]:hover:not(:disabled) {
  background: #d35400;
}

button[type="submit"]:disabled {
  opacity: 0.7;
}

.mensaje {
  margin-top: 15px;
  color: #27ae60;
  text-align: center;
  white-space: pre-line;
}

.error-message {
  margin-top: 15px;
  color: #e74c3c;
  text-align: center;
}

/* Estilos de redirección */
.redirigiendo {
  margin-top: 20px;
  padding: 15px;
  background: #e8f5e9;
  border-radius: 10px;
  text-align: center;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #27ae60;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.redirigiendo p {
  margin: 5px 0;
  color: #2c3e50;
}
</style>