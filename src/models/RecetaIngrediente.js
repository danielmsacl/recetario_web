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
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    unidad: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: 'unidades'
    }
  }, {
    tableName: 'receta_ingredientes',
    timestamps: false
  });

  RecetaIngrediente.associate = (db) => {
    RecetaIngrediente.belongsTo(db.Receta, { foreignKey: 'receta_id' });
    RecetaIngrediente.belongsTo(db.Ingrediente, { foreignKey: 'ingrediente_id' });
  };

  return RecetaIngrediente;
};