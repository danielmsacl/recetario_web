const express = require('express');
const router = express.Router();
const recetaDelDiaController = require('../controllers/recetaDelDiaController');
const authMiddleware = require('../middlewares/auth');

// Rutas públicas
router.get('/receta-del-dia', recetaDelDiaController.getRecetaDelDia);
router.get('/recetas-para-combobox', recetaDelDiaController.getTodasRecetas);

// Rutas protegidas 
router.post('/receta-del-dia', authMiddleware, recetaDelDiaController.asignarRecetaDelDia);

module.exports = router;