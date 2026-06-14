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
    
    // Verificar si el ingrediente está siendo usado en alguna receta
    const [result] = await Ingrediente.sequelize.query(`
      SELECT COUNT(*) as en_uso
      FROM receta_ingredientes
      WHERE ingrediente_id = ?
    `, {
      replacements: [req.params.id],
      type: Ingrediente.sequelize.QueryTypes.SELECT
    });
    
    if (result.en_uso > 0) {
      const error = new Error(`No se puede eliminar "${ingrediente.nombre}" porque está siendo usado en una o más recetas`);
      error.status = 409;
      return next(error);
    }
    
    // Si no está en uso, eliminar
    await ingrediente.destroy();
    res.json({ mensaje: 'Ingrediente eliminado correctamente' });
    
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };