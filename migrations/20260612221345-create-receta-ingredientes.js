'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('receta_ingredientes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      receta_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'recetas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      ingrediente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ingredientes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      unidad: {
        type: Sequelize.STRING(20),
        allowNull: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('receta_ingredientes');
  }
};