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
              <button @click="editarReceta(receta.id)" class="btn-editar">✏️ Editar</button>
              <button @click="eliminarReceta(receta.id)" class="btn-eliminar">🗑️ Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button @click="crearReceta" class="btn-crear">+ Crear Nueva Receta</button>
  </div>
</template>

<script setup>
const { data: recetas, pending, error, refresh } = await useFetch('http://localhost:3001/api/recetas')

const volver = () => {
  navigateTo('/principal')
}

const editarReceta = (id) => {
  navigateTo(`/admin/recetas/${id}/editar`)
}

const eliminarReceta = async (id) => {
  if (confirm('¿Estás seguro de eliminar esta receta?')) {
    await fetch(`http://localhost:3001/api/recetas/${id}`, { method: 'DELETE' })
    refresh() // Recargar la lista
  }
}

const crearReceta = () => {
  navigateTo('/admin/recetas/nueva')
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.admin-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.btn-volver {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.tabla-recetas {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.tabla-recetas th,
.tabla-recetas td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.tabla-recetas th {
  background: #e67e22;
  color: white;
}

.preparacion-cell {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.acciones {
  display: flex;
  gap: 10px;
}

.btn-editar {
  background: #3498db;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-eliminar {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-crear {
  background: #27ae60;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
  font-size: 1rem;
}

.btn-crear:hover {
  background: #219a52;
}
</style>