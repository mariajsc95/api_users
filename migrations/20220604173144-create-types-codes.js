'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TypesCodes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        field: "id",
      },
      nombre: {
        type: Sequelize.STRING(50),
        allowNull: false,
        field: "nombre"
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TypesCodes');
  }
};