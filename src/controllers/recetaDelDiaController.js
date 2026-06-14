const { RecetaDelDia, Receta } = require('../models');
const { Op } = require('sequelize');

// Obtener la receta del día actual
const getRecetaDelDia = async (req, res, next) => {
  try {
    const hoy = new Date().toISOString().split('T')[0];
    
    let recetaDelDia = await RecetaDelDia.findOne({
      where: { fecha: hoy, activo: true },
      include: [{ model: Receta, attributes: ['id', 'titulo', 'url_imagen', 'preparacion', 'dificultad'] }]
    });
    
    // Si no hay receta asignada para hoy, obtener una aleatoria
    if (!recetaDelDia) {
      const recetaAleatoria = await Receta.findOne({
        order: sequelize.random(),
        attributes: ['id', 'titulo', 'url_imagen', 'preparacion', 'dificultad']
      });
      
      return res.json({
        esAleatoria: true,
        receta: recetaAleatoria
      });
    }
    
    res.json({
      esAleatoria: false,
      receta: recetaDelDia.Receta
    });
  } catch (error) {
    next(error);
  }
};

// Obtener todas las recetas 
const getTodasRecetas = async (req, res, next) => {
  try {
    const recetas = await Receta.findAll({
      attributes: ['id', 'titulo'],
      order: [['titulo', 'ASC']]
    });
    res.json(recetas);
  } catch (error) {
    next(error);
  }
};

// Asignar receta del día (solo admin)
const asignarRecetaDelDia = async (req, res, next) => {
  try {
    const { receta_id, fecha } = req.body;
    const fechaAsignar = fecha || new Date().toISOString().split('T')[0];
    
    const [recetaDelDia, created] = await RecetaDelDia.upsert({
      receta_id,
      fecha: fechaAsignar,
      activo: true
    });
    
    res.json({ mensaje: 'Receta del día asignada', recetaDelDia });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecetaDelDia,
  getTodasRecetas,
  asignarRecetaDelDia
};