const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Ingrediente = sequelize.define('Ingrediente', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, {
    tableName: 'ingredientes',
    timestamps: false
  });

  return Ingrediente;
};