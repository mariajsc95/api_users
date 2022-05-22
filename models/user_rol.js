'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_rol extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_rol.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
  },
    uro_rol_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "uro_rol_id"
    },
    uro_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "uro_user_id"
    }
  }, {
    sequelize,
    modelName: 'user_rol',
    timestamps: false
  });
  return user_rol;
};