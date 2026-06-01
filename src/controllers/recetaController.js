const { Receta, Ingrediente, RecetaIngrediente } = require('../models');


const getAll = async (req, res) => {
  try {
    const recetas = await Receta.findAll();
    res.json(recetas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getById = async (req, res) => {
  try {
    const receta = await Receta.findByPk(req.params.id, {
      include: Ingrediente
    });
    if (!receta) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
    res.json(receta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// CREAR 

const create = async (req, res) => {
  try {
    const { titulo, preparacion } = req.body;  
    if (!titulo) {
      return res.status(400).json({ error: 'El título es obligatorio' });
    }
    const receta = await Receta.create({ titulo, preparacion });  
    res.status(201).json(receta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//ACTUALIZAR

const update = async (req, res) => {
  try {
    const receta = await Receta.findByPk(req.params.id);
    if (!receta) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
    const { titulo, preparacion } = req.body;  
    await receta.update({ titulo, preparacion });  
    res.json(receta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const receta = await Receta.findByPk(req.params.id);
    if (!receta) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
    await receta.destroy();
    res.json({ mensaje: 'Receta eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
