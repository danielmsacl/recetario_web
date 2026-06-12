const express = require('express');
const router = express.Router();
const ingredienteController = require('../controllers/ingredienteController');
const authMiddleware = require('../middlewares/auth');

router.get('/ingredientes', ingredienteController.getAll);
router.get('/ingredientes/:id', ingredienteController.getById);
/*
    Rutas con middleware
*/
router.post('/ingredientes', authMiddleware, ingredienteController.create);
router.put('/ingredientes/:id', authMiddleware, ingredienteController.update);
router.delete('/ingredientes/:id', authMiddleware, ingredienteController.remove);

module.exports = router;