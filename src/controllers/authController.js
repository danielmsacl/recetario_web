const { Usuario, PasswordResetToken } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize'); 

//-------------------------------------------------------------------------------------
// LOGIN/REGISTRO/FUNCIONES DE USUARIOS
//-------------------------------------------------------------------------------------

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

//-------------------------------------------------------------------------------
// Solicitar restablecimiento de contraseña
//-------------------------------------------------------------------------------

const solicitarReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'El email es obligatorio' });
    }
    
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.json({ mensaje: 'Si el email existe, recibirás un enlace de restablecimiento' });
    }
    
    await PasswordResetToken.destroy({ where: { email } });
    
    const token = crypto.randomBytes(32).toString('hex');
    const expires_at = new Date();
    expires_at.setHours(expires_at.getHours() + 1); 
    
    await PasswordResetToken.create({
      email,
      token,
      expires_at
    });
    
    console.log(`🔐 Token de restablecimiento para ${email}: ${token}`);
    console.log(`🔗 URL: http://localhost:3000/restablecer/${token}`);
    
    res.json({ 
      mensaje: 'Si el email existe, recibirás un enlace de restablecimiento',
      dev_token: process.env.NODE_ENV === 'development' ? token : undefined
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verificarToken = async (req, res) => {
  try {
    const { token } = req.params;
    
    const resetToken = await PasswordResetToken.findOne({ 
      where: { 
        token,
        expires_at: { [Op.gt]: new Date() } 
      }
    });
    
    if (!resetToken) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }
    
    res.json({ valido: true, email: resetToken.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const restablecerPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }
    
    const resetToken = await PasswordResetToken.findOne({ 
      where: { 
        token,
        expires_at: { [Op.gt]: new Date() }
      }
    });
    
    if (!resetToken) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }
    
    const usuario = await Usuario.findOne({ where: { email: resetToken.email } });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    usuario.password = password;
    await usuario.save();
    
    await PasswordResetToken.destroy({ where: { id: resetToken.id } });
    
    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// EXPORTS
module.exports = { 
  registrar, 
  login, 
  getUsuarios, 
  getUsuarioById,
  update,
  remove,
  solicitarReset,
  verificarToken,
  restablecerPassword
};