const express = require('express');
const router = express.Router();
const recetaController = require('../controllers/recetaController');
const authMiddleware = require('../middlewares/auth'); 

router.get('/recetas', recetaController.getAll);
router.get('/recetas/:id', recetaController.getById);
/*
    Rutas con middleware
*/
router.post('/recetas', authMiddleware, recetaController.create);
router.put('/recetas/:id', authMiddleware, recetaController.update);
router.delete('/recetas/:id', authMiddleware, recetaController.remove);

module.exports = router;