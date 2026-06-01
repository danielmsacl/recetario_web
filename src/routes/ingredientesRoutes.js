const express = require('express');
const router = express.Router();
const ingredienteController = require('../controllers/ingredienteController');

router.get('/ingredientes', ingredienteController.getAll);
router.get('/ingredientes/:id', ingredienteController.getById);
router.post('/ingredientes', ingredienteController.create);
router.put('/ingredientes/:id', ingredienteController.update);
router.delete('/ingredientes/:id', ingredienteController.remove);

module.exports = router;