<template>
  <div class="restablecer-container">
    <div class="restablecer-card">
      <button @click="volver" class="btn-volver">← Volver</button>
      <h1>🔐 Nueva Contraseña</h1>
      
      <div v-if="tokenInvalido" class="error">
        Token inválido o expirado. Solicita un nuevo enlace.
      </div>
      
      <form v-else @submit.prevent="restablecer">
        <div class="form-group">
          <label>Nueva contraseña</label>
          <input type="password" v-model="password" placeholder="******" required />
        </div>
        
        <div class="form-group">
          <label>Confirmar contraseña</label>
          <input type="password" v-model="confirmar" placeholder="******" required />
        </div>
        
        <button type="submit" :disabled="cargando">
          {{ cargando ? 'Guardando...' : 'Guardar nueva contraseña' }}
        </button>
        
        <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
        <p v-if="errorMsg" class="error-message">{{ errorMsg }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const route = useRoute()
const token = route.params.token

const password = ref('')
const confirmar = ref('')
const cargando = ref(false)
const mensaje = ref('')
const errorMsg = ref('')
const tokenInvalido = ref(false)

onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:3001/api/auth/verificar-token/${token}`)
    if (!res.ok) {
      tokenInvalido.value = true
    }
  } catch (err) {
    tokenInvalido.value = true
  }
})

const restablecer = async () => {
  if (password.value !== confirmar.value) {
    errorMsg.value = 'Las contraseñas no coinciden'
    return
  }
  
  if (password.value.length < 6) {
    errorMsg.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }
  
  cargando.value = true
  errorMsg.value = ''
  mensaje.value = ''
  
  try {
    const res = await fetch(`http://localhost:3001/api/auth/restablecer/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value })
    })
    
    const data = await res.json()
    
    if (res.ok) {
      mensaje.value = 'Contraseña actualizada. Redirigiendo...'
      setTimeout(() => navigateTo('/'), 2000)
    } else {
      errorMsg.value = data.error || 'Error al restablecer'
    }
  } catch (err) {
    errorMsg.value = 'Error de conexión'
  } finally {
    cargando.value = false
  }
}

const volver = () => {
  navigateTo('/')
}
</script>

<style scoped>
.restablecer-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4a0e4e 0%, #2d0a2e 100%);
}

.restablecer-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  width: 100%;
  max-width: 450px;
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

.restablecer-card h1 {
  color: #e67e22;
  margin-bottom: 30px;
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
}

.error-message {
  margin-top: 15px;
  color: #e74c3c;
  text-align: center;
}

.error {
  text-align: center;
  padding: 20px;
  color: #e74c3c;
  background: #fdeaea;
  border-radius: 10px;
}
</style>