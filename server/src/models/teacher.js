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

      // Teacher.belongsTo(models.Class, {
      //   foreignKey: "name", // khóa ngoại từ bảng này
      //   targetKey: "class_name", //lấy từ bảng kia
      //   as: "teacherData",
      // });
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
    },
    {
      sequelize,
      modelName: "Teacher",
    }
  );

  return Teacher;
};
