"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Teacher.belongsTo(models.Role, {
        foreignKey: "role",
        targetKey: "code",
        as: "roleData",
      });

      Teacher.hasMany(models.Class, {
        foreignKey: "id_teacher",
        as: "classData",
      });
    }
  }
  Teacher.init(
    {
      role: DataTypes.STRING,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.INTEGER(11),
      avatar: DataTypes.STRING,
      address: DataTypes.STRING,
      refresh_token: DataTypes.STRING,
      filename: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Teacher",
    }
  );

  return Teacher;
};
