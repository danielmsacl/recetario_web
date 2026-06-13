const { Receta, Ingrediente, RecetaIngrediente } = require('../models');

const getAll = async (req, res, next) => {
  try {
    const recetas = await Receta.findAll();
    res.json(recetas);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const receta = await Receta.findByPk(req.params.id, {
      include: Ingrediente
    });
    if (!receta) {
      const error = new Error('Receta no encontrada');
      error.status = 404;
      return next(error);
    }
    res.json(receta);
  } catch (error) {
    next(error);
  }
};

// CREAR 
const create = async (req, res, next) => {
  try {
    const { titulo, preparacion, url_imagen, dificultad } = req.body;
    if (!titulo) {
      const error = new Error('El título es obligatorio');
      error.status = 400;
      return next(error);
    }
    const receta = await Receta.create({ 
      titulo, 
      preparacion, 
      url_imagen, 
      dificultad 
    });
    res.status(201).json(receta);
  } catch (error) {
    next(error);
  }
};

// ACTUALIZAR
const update = async (req, res, next) => {
  try {
    const receta = await Receta.findByPk(req.params.id);
    if (!receta) {
      const error = new Error('Receta no encontrada');
      error.status = 404;
      return next(error);
    }
    const { titulo, preparacion, url_imagen, dificultad } = req.body;
    await receta.update({ 
      titulo, 
      preparacion, 
      url_imagen, 
      dificultad 
    });
    res.json(receta);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const receta = await Receta.findByPk(req.params.id);
    if (!receta) {
      const error = new Error('Receta no encontrada');
      error.status = 404;
      return next(error);
    }
    await receta.destroy();
    res.json({ mensaje: 'Receta eliminada' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};