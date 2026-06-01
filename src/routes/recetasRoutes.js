const express = require('express');
const router = express.Router();
const recetaController = require('../controllers/recetaController');

router.get('/recetas', recetaController.getAll);
router.get('/recetas/:id', recetaController.getById);
router.post('/recetas', recetaController.create);
router.put('/recetas/:id', recetaController.update);
router.delete('/recetas/:id', recetaController.remove);

module.exports = router;