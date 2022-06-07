'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Codes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        field: "id"
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "id_usuario",
        references: { model: { tableName: "users" }, key: "id" }
      },
      tipo_codigo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "tipo_codigo",
        references: { model: { tableName: "typescodes" }, key: "id" },
      },
      codigo: {
        type: Sequelize.STRING,
        allowNull: false,
        field: "codigo"
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Codes');
  }
};