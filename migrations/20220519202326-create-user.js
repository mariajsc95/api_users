'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      usuario: {
        type: Sequelize.STRING(50),
        allowNull: false,
        field: "usuario"
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        field: "email"
      },
      password: {
        type: Sequelize.STRING(50),
        allowNull: false,
        field: "password"
      },
      status: {
       type: Sequelize.STRING(20),
      allowNull: false,
      field: "status"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};