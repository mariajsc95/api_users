'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.belongsToMany(models.Rol , {
        through: "user_rols",
        foreignKey: "uro_user_id"
      })
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    usuario:{ 
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "usuario"
    },
    password: { 
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "password"
    },
    status: { 
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "status"

    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });
  return User;
};