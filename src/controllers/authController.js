const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro
const registrar = async (req, res) => {
  try {
    const { email, password, nombre } = req.body;
    
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    const usuario = await Usuario.create({ 
      email, 
      password, 
      nombre,
      rol: 'usuario'
    });
    
    res.status(201).json({ 
      id: usuario.id, 
      email: usuario.email, 
      nombre: usuario.nombre,
      rol: usuario.rol 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET || 'secreto_temporal',
      { expiresIn: '7d' }
    );
    console.log('Enviando usuario con rol:', usuario.rol);
    res.json({ 
      token, 
      usuario: { 
        id: usuario.id, 
        email: usuario.email, 
        nombre: usuario.nombre,
        rol: usuario.rol   
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombre', 'email', 'rol', 'created_at', 'updated_at']
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un usuario por ID
const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id, {
      attributes: ['id', 'nombre', 'email', 'rol', 'created_at', 'updated_at']
    });
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar usuario
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, rol } = req.body;
    
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    if (nombre !== undefined) usuario.nombre = nombre;
    if (email !== undefined) usuario.email = email;
    if (rol !== undefined) usuario.rol = rol;
    
    await usuario.save();
    
    const usuarioActualizado = await Usuario.findByPk(id, {
      attributes: ['id', 'nombre', 'email', 'rol', 'created_at', 'updated_at']
    });
    
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar usuario
const remove = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    await usuario.destroy();
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { 
  registrar, 
  login, 
  getUsuarios, 
  getUsuarioById,
  update,
  remove
};