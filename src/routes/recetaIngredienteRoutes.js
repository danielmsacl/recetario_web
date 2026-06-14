const express = require('express');
const router = express.Router();
const recetaIngredienteController = require('../controllers/recetaIngredienteController');
const authMiddleware = require('../middlewares/auth');

// Rutas públicas 
router.get('/recetas/:recetaId/ingredientes', recetaIngredienteController.getByReceta);

// Rutas protegidas 
router.post('/recetas/:recetaId/ingredientes', authMiddleware, recetaIngredienteController.addIngrediente);
router.put('/receta-ingredientes/:id', authMiddleware, recetaIngredienteController.updateCantidad);
router.delete('/receta-ingredientes/:id', authMiddleware, recetaIngredienteController.removeIngrediente);

module.exports = router;