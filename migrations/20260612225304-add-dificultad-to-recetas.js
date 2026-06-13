'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('recetas', 'dificultad', {
      type: Sequelize.ENUM('fácil', 'media', 'difícil'),
      allowNull: false,
      defaultValue: 'media'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('recetas', 'dificultad');
  }
};