const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Receta = sequelize.define('Receta', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    preparacion: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'recetas',
    timestamps: false
  });

  return Receta;
};