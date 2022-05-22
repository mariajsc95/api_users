'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_rols', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
      uro_rol_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "uro_rol_id",
        onDelete: "CASCADE",
        references: { model: { tableName: "rols" }, key: "id" },
      },
      uro_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "uro_user_id",
        onDelete: "CASCADE",
        references: { model: { tableName: "users" }, key: "id" },
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_rols');
  }
};