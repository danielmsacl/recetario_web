<template>
  <div class="restablecer-container">
    <div class="restablecer-card">
      <button @click="volver" class="btn-volver">← Volver</button>
      <h1>🔐 Nueva Contraseña</h1>
      
      <div v-if="cargandoToken" class="loading">
        <div class="spinner"></div>
        <p>Verificando token...</p>
      </div>
      
      <div v-else-if="tokenInvalido" class="error">
        <span class="error-icon">⚠️</span>
        <p>Token inválido o expirado.</p>
        <p>Solicita un nuevo enlace de recuperación.</p>
        <button @click="irARecuperar" class="btn-recuperar">Solicitar nuevo enlace</button>
      </div>
      
      <form v-else @submit.prevent="restablecer" class="form-restablecer">
        <div class="form-group">
          <label>Nueva contraseña</label>
          <div class="input-icon">
            <span class="icon">🔒</span>
            <input 
              type="password" 
              v-model="password" 
              required
              placeholder="Mínimo 6 caracteres"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label>Confirmar contraseña</label>
          <div class="input-icon">
            <span class="icon">✅</span>
            <input 
              type="password" 
              v-model="confirmar" 
              required
              placeholder="Repite tu contraseña"
            />
          </div>
        </div>
        
        <button type="submit" class="btn-guardar" :disabled="cargando">
          {{ cargando ? 'Guardando...' : '💾 Guardar nueva contraseña' }}
        </button>
        
        <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
        <p v-if="errorMsg" class="error-message">{{ errorMsg }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const API_URL = 'https://recetarioweb-production.up.railway.app'
const route = useRoute()
const token = route.params.token

const password = ref('')
const confirmar = ref('')
const cargando = ref(false)
const cargandoToken = ref(true)
const mensaje = ref('')
const errorMsg = ref('')
const tokenInvalido = ref(false)

// Verificar token al cargar
onMounted(async () => {
  try {
    const res = await fetch(`${API_URL}/api/auth/verificar-token/${token}`)
    if (!res.ok) {
      tokenInvalido.value = true
    }
  } catch (err) {
    tokenInvalido.value = true
  } finally {
    cargandoToken.value = false
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
    const res = await fetch(`${API_URL}/api/auth/restablecer/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value })
    })
    
    const data = await res.json()
    
    if (res.ok) {
      mensaje.value = '✅ Contraseña actualizada. Redirigiendo...'
      setTimeout(() => navigateTo('/'), 2000)
    } else {
      errorMsg.value = data.error || 'Error al restablecer'
    }
  } catch (err) {
    errorMsg.value = 'Error de conexión con el servidor'
  } finally {
    cargando.value = false
  }
}

const volver = () => {
  navigateTo('/')
}

const irARecuperar = () => {
  navigateTo('/recuperar_pass')
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
  transition: color 0.2s;
}

.btn-volver:hover {
  color: #d35400;
}

.restablecer-card h1 {
  color: #e67e22;
  margin-bottom: 30px;
  text-align: center;
  font-size: 1.8rem;
}

/* Loading */
.loading {
  text-align: center;
  padding: 30px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #e67e22;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  color: #6c757d;
}

/* Formulario */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
}

.input-icon {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: border-color 0.2s;
}

.input-icon:focus-within {
  border-color: #e67e22;
}

.icon {
  padding: 12px;
  color: #6c757d;
  font-size: 1rem;
}

.input-icon input {
  flex: 1;
  padding: 12px 12px 12px 0;
  border: none;
  outline: none;
  font-size: 1rem;
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
  transition: all 0.3s;
  margin-top: 10px;
}

button[type="submit"]:hover:not(:disabled) {
  background: #d35400;
  transform: translateY(-2px);
}

button[type="submit"]:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.mensaje {
  margin-top: 15px;
  color: #27ae60;
  text-align: center;
  font-weight: 500;
}

.error-message {
  margin-top: 15px;
  color: #e74c3c;
  text-align: center;
  font-size: 0.9rem;
}

.error {
  text-align: center;
  padding: 30px;
  color: #e74c3c;
  background: #fdeaea;
  border-radius: 10px;
}

.error-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 10px;
}

.btn-recuperar {
  margin-top: 15px;
  background: #e67e22;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.btn-recuperar:hover {
  background: #d35400;
}
</style>