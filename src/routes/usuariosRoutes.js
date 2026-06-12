const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');

// Rutas 
router.post('/registro', authController.registrar);
router.post('/login', authController.login);

// Rutas protegidas con JWT
router.get('/usuarios', authMiddleware, authController.getUsuarios);
router.get('/usuarios/:id', authMiddleware, authController.getUsuarioById);
router.put('/usuarios/:id', authMiddleware, authController.update);
router.delete('/usuarios/:id', authMiddleware, authController.remove);

module.exports = router;