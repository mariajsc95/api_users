'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Codes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Codes.belongsTo(models.User, {
        foreignKey: "id_usuario"
      });
      models.Codes.belongsTo(models.TypesCodes, {
        foreignKey: "tipo_codigo"
      })
    }
  }
  Codes.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_usuario"
    },
    tipo_codigo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "tipo_codigo"
    },
    codigo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "codigo"
    },
  }, {
    sequelize,
    modelName: 'Codes',
    tableName: 'codes',
    timestamps: false
  });
  return Codes;
};