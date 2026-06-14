const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RecetaDelDia = sequelize.define('RecetaDelDia', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    receta_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'receta_del_dia',
    timestamps: true,
    underscored: true
  });

  RecetaDelDia.associate = (db) => {
    RecetaDelDia.belongsTo(db.Receta, { foreignKey: 'receta_id' });
  };

  return RecetaDelDia;
};