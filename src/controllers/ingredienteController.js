const { Ingrediente } = require('../models');

const getAll = async (req, res, next) => {
  try {
    const ingredientes = await Ingrediente.findAll();
    res.json(ingredientes);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const ingrediente = await Ingrediente.findByPk(req.params.id);
    if (!ingrediente) {
      const error = new Error('Ingrediente no encontrado');
      error.status = 404;
      return next(error);
    }
    res.json(ingrediente);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      const error = new Error('El nombre es obligatorio');
      error.status = 400;
      return next(error);
    }
    const ingrediente = await Ingrediente.create({ nombre });
    res.status(201).json(ingrediente);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      error.status = 409;
      error.message = 'El ingrediente ya existe';
      return next(error);
    }
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const ingrediente = await Ingrediente.findByPk(req.params.id);
    if (!ingrediente) {
      const error = new Error('Ingrediente no encontrado');
      error.status = 404;
      return next(error);
    }
    const { nombre } = req.body;
    await ingrediente.update({ nombre });
    res.json(ingrediente);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const ingrediente = await Ingrediente.findByPk(req.params.id);
    if (!ingrediente) {
      const error = new Error('Ingrediente no encontrado');
      error.status = 404;
      return next(error);
    }
    
    // Verificar si el ingrediente está activo
    if (ingrediente.activo === true) {
      const error = new Error('No se puede eliminar un ingrediente activo. Desactívalo primero.');
      error.status = 409;
      return next(error);
    }
    
    // Si está inactivo, eliminar
    await ingrediente.destroy();
    res.json({ mensaje: 'Ingrediente eliminado' });
    
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };