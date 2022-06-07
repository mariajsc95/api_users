'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TypesCodes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.TypesCodes.hasMany(models.Codes, {
        as: "TypesCodes",
        foreignKey: "tipo_codigo"
      })
    }
  }
  TypesCodes.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "nombre"
    }
  }, {
    sequelize,
    modelName: 'TypesCodes',
    tableName: 'typescodes',
    timestamps: false
  });
  return TypesCodes;
};