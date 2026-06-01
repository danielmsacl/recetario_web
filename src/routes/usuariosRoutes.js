const express = require('express');
const router = express.Router();
const { Usuario } = require('../models');  // ← Cambiar esta línea
const bcrypt = require('bcryptjs');

// Registrar nuevo usuario
router.post('/registro', async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const usuarioExistente = await Usuario.findOne({ where: { email } });
  if (usuarioExistente) {
    return res.status(409).json({ error: 'El email ya está registrado' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password
    });

    res.status(201).json({
      id: nuevoUsuario.id,
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;