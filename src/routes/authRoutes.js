const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');


// RUTAS PÚBLICAS 
router.post('/registro', authController.registrar);
router.post('/login', authController.login);

// RUTAS PROTEGIDAS con JWT
router.get('/usuarios', authMiddleware, authController.getUsuarios);
router.get('/usuarios/:id', authMiddleware, authController.getUsuarioById);
router.put('/usuarios/:id', authMiddleware, authController.update);
router.delete('/usuarios/:id', authMiddleware, authController.remove);

//RUTAS REST. CONTRASEÑA
router.post('/solicitar-reset', authController.solicitarReset);
router.get('/verificar-token/:token', authController.verificarToken);
router.post('/restablecer/:token', authController.restablecerPassword);

module.exports = router;