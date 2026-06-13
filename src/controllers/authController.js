const { Usuario, PasswordResetToken } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize'); 

//-------------------------------------------------------------------------------------
// LOGIN/REGISTRO/FUNCIONES DE USUARIOS
//-------------------------------------------------------------------------------------

// Registro
const registrar = async (req, res, next) => {
  try {
    const { email, password, nombre } = req.body;
    
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      const error = new Error('El email ya está registrado');
      error.status = 400;
      return next(error);
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
    next(error);
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      const error = new Error('Credenciales inválidas');
      error.status = 401;
      return next(error);
    }
    
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      const error = new Error('Credenciales inválidas');
      error.status = 401;
      return next(error);
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
    next(error);
  }
};

// Obtener todos los usuarios
const getUsuarios = async (req, res, next) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombre', 'email', 'rol', 'created_at', 'updated_at']
    });
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
};

// Obtener un usuario por ID
const getUsuarioById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id, {
      attributes: ['id', 'nombre', 'email', 'rol', 'created_at', 'updated_at']
    });
    
    if (!usuario) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      return next(error);
    }
    
    res.json(usuario);
  } catch (error) {
    next(error);
  }
};

// Actualizar usuario
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, email, rol } = req.body;
    
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      return next(error);
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
    next(error);
  }
};

// Eliminar usuario
const remove = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      return next(error);
    }
    await usuario.destroy();
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    next(error);
  }
};

//-------------------------------------------------------------------------------
// Solicitar restablecimiento de contraseña
//-------------------------------------------------------------------------------

const solicitarReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      const error = new Error('El email es obligatorio');
      error.status = 400;
      return next(error);
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
    next(error);
  }
};

const verificarToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    const resetToken = await PasswordResetToken.findOne({ 
      where: { 
        token,
        expires_at: { [Op.gt]: new Date() } 
      }
    });
    
    if (!resetToken) {
      const error = new Error('Token inválido o expirado');
      error.status = 400;
      return next(error);
    }
    
    res.json({ valido: true, email: resetToken.email });
  } catch (error) {
    next(error);
  }
};

const restablecerPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    if (!password || password.length < 6) {
      const error = new Error('La contraseña debe tener al menos 6 caracteres');
      error.status = 400;
      return next(error);
    }
    
    const resetToken = await PasswordResetToken.findOne({ 
      where: { 
        token,
        expires_at: { [Op.gt]: new Date() }
      }
    });
    
    if (!resetToken) {
      const error = new Error('Token inválido o expirado');
      error.status = 400;
      return next(error);
    }
    
    const usuario = await Usuario.findOne({ where: { email: resetToken.email } });
    if (!usuario) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      return next(error);
    }
    
    usuario.password = password;
    await usuario.save();
    
    await PasswordResetToken.destroy({ where: { id: resetToken.id } });
    
    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    next(error);
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