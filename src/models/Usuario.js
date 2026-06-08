const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize) => {
  const Usuario = sequelize.define(
    "Usuario",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      rol: {  // ← Mueve 'rol' AQUÍ, dentro de los atributos
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "usuario",
      },
    },
    {
      tableName: "usuarios",
      timestamps: true,
      underscored: true,
      hooks: {
        beforeCreate: async (usuario) => {
          usuario.password = await bcrypt.hash(usuario.password, 10);
        },
      },
    }
  );

  return Usuario;
};