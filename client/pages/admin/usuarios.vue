<template>
  <div class="pagina-desarrollo">
    <div class="admin-header">
      <button @click="volver" class="btn-volver">← Volver</button>
      <h1>👥 Gestión de Usuarios</h1>
    </div>
    
    <div class="imagen-container">
      <img 
        src="http://localhost:3001/uploads/pagina_no_lista.png" 
        alt="Página en desarrollo"
        class="imagen-desarrollo"
      >
      <p class="mensaje-desarrollo">🚧 Módulo en desarrollo. Próximamente disponible.</p>
    </div>
  </div>
</template>

<script setup>
const volver = () => {
  navigateTo('/principal')
}
</script>

<style scoped>
.pagina-desarrollo {
  min-height: 100vh;
  background: #f8f9fa;
}

.admin-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.btn-volver {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.imagen-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  min-height: calc(100vh - 80px);
}

.imagen-desarrollo {
  width: 90vw;
  max-width: 1200px;
  height: auto;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.mensaje-desarrollo {
  margin-top: 30px;
  font-size: 1.5rem;
  color: #e67e22;
  font-weight: bold;
  text-align: center;
}

@media (max-width: 768px) {
  .imagen-desarrollo {
    width: 95vw;
  }
  
  .mensaje-desarrollo {
    font-size: 1.2rem;
  }
}
</style>