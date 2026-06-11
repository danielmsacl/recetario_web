<template>
  <div class="recuperar-container">
    <div class="recuperar-card">
      <button @click="volver" class="btn-volver">← Volver</button>
      <h1>🔐 Recuperar Contraseña</h1>
      <p>Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña</p>
      
      <form @submit.prevent="handleRecuperar" v-if="!mostrarMensaje">
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" placeholder="tu@email.com" required />
        </div>
        
        <button type="submit" :disabled="cargando">
          {{ cargando ? 'Enviando...' : 'Recuperar contraseña' }}
        </button>
        
        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
      
      <!-- Mensaje con imagen del gato -->
      <div v-else class="mensaje-container">
        <img 
          :src="imagenGato" 
          alt="Gato triste"
          class="gato-imagen"
          @error="imagenError = true"
        />
        <h2 class="mensaje-titulo">⚠️ Olvidar la contraseña es de tontos ⚠️</h2>
        <p class="mensaje-texto">
          a comer mas pasas
        </p>
        <button @click="reiniciar" class="btn-reintentar">Intentar de nuevo</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const cargando = ref(false)
const error = ref('')
const mostrarMensaje = ref(false)
const imagenError = ref(false)

// Ruta de la imagen del gato
const imagenGato = 'http://localhost:3001/uploads/gato.jpg'

const handleRecuperar = async () => {
  cargando.value = true
  error.value = ''
  
  try {
    // Simulación de envío (siempre muestra el error con el gato)
    setTimeout(() => {
      cargando.value = false
      mostrarMensaje.value = true
    }, 1000)
    
  } catch (err) {
    error.value = 'Error de conexión con el servidor'
    cargando.value = false
  }
}

const volver = () => {
  navigateTo('/')
}

const reiniciar = () => {
  mostrarMensaje.value = false
  email.value = ''
}
</script>

<style scoped>
.recuperar-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f6f5f7, #e9ecef);
}

.recuperar-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
  position: relative;
}

.recuperar-card h1 {
  color: #E67E22;
  margin-bottom: 20px;
}

.btn-volver {
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  font-size: 1rem;
  color: #E67E22;
  cursor: pointer;
  padding: 5px;
}

.btn-volver:hover {
  text-decoration: underline;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
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
  border-color: #E67E22;
}

button[type="submit"] {
  width: 100%;
  padding: 12px;
  background: #E67E22;
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

.error-message {
  margin-top: 15px;
  color: #e74c3c;
}

/* Estilos del mensaje con gato */
.mensaje-container {
  text-align: center;
}

.gato-imagen {
  max-width: 200px;
  margin: 20px auto;
  display: block;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.mensaje-titulo {
  color: #e74c3c;
  font-size: 1.5rem;
  margin: 20px 0 10px;
}

.mensaje-texto {
  color: #555;
  line-height: 1.6;
  margin-bottom: 25px;
}

.btn-reintentar {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-reintentar:hover {
  background: #5a6268;
}
</style>