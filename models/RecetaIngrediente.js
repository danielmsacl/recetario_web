const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RecetaIngrediente = sequelize.define('RecetaIngrediente', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    receta_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ingrediente_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    unidad: {
      type: DataTypes.STRING(20)
    }
  }, {
    tableName: 'receta_ingredientes',
    timestamps: false
  });

  return RecetaIngrediente;
};