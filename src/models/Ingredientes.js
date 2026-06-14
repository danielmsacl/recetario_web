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
    }
  }, {
    tableName: 'ingredientes',
    timestamps: false
  });

  return Ingrediente;
};