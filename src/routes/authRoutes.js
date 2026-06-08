const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/registro', authController.registrar);
router.post('/login', authController.login);
router.get('/usuarios', authController.getUsuarios);
router.get('/usuarios/:id', authController.getUsuarioById);
router.put('/usuarios/:id', authController.update);
router.delete('/usuarios/:id', authController.remove);

module.exports = router;