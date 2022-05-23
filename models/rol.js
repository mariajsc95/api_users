'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rol extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Rol.belongsToMany(models.User , {
        through: "user_rols",
        foreignKey: "uro_rol_id"
      })
    }
  }
  Rol.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    nombre:{ 
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "nombre"
    },
  }, {
    sequelize,
    modelName: 'Rol',
    tableName: 'rols'
  });
  return Rol;
};