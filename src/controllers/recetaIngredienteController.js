const { RecetaIngrediente, Ingrediente } = require('../models');

// Obtener ingredientes de una receta
const getByReceta = async (req, res, next) => {
  try {
    const { recetaId } = req.params;
    const ingredientes = await RecetaIngrediente.findAll({
      where: { receta_id: recetaId },
      include: [{ model: Ingrediente, attributes: ['id', 'nombre'] }]
    });
    res.json(ingredientes);
  } catch (error) {
    next(error);
  }
};

// Agregar ingrediente a receta
const addIngrediente = async (req, res, next) => {
  try {
    const { recetaId } = req.params;
    const { ingrediente_id, cantidad, unidad } = req.body;
    
    // Verificar si ya existe
    let recetaIngrediente = await RecetaIngrediente.findOne({
      where: { receta_id: recetaId, ingrediente_id }
    });
    
    if (recetaIngrediente) {
      // Actualizar cantidad
      await recetaIngrediente.update({ cantidad, unidad });
    } else {
      // Crear nuevo
      recetaIngrediente = await RecetaIngrediente.create({
        receta_id: recetaId,
        ingrediente_id,
        cantidad,
        unidad
      });
    }
    
    res.json(recetaIngrediente);
  } catch (error) {
    next(error);
  }
};

// Actualizar cantidad de ingrediente
const updateCantidad = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cantidad, unidad } = req.body;
    
    const recetaIngrediente = await RecetaIngrediente.findByPk(id);
    if (!recetaIngrediente) {
      const error = new Error('Relación no encontrada');
      error.status = 404;
      return next(error);
    }
    
    await recetaIngrediente.update({ cantidad, unidad });
    res.json(recetaIngrediente);
  } catch (error) {
    next(error);
  }
};

// Eliminar ingrediente de receta
const removeIngrediente = async (req, res, next) => {
  try {
    const { id } = req.params;
    await RecetaIngrediente.destroy({ where: { id } });
    res.json({ mensaje: 'Ingrediente eliminado de la receta' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getByReceta,
  addIngrediente,
  updateCantidad,
  removeIngrediente
};