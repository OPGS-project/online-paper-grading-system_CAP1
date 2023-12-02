"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student.belongsTo(models.Class, {
        foreignKey: "class_id",
        targetKey: "id",
        as: "classData",
      });
    }
  }
  Student.init(
    {
      class_id: DataTypes.INTEGER,
      student_name: DataTypes.STRING,
      phone: DataTypes.INTEGER,
      gender: DataTypes.STRING,
      address: DataTypes.STRING,
      username: DataTypes.STRING,
      avatar: DataTypes.STRING,
      birthday: DataTypes.DATE,
      password: DataTypes.STRING,
      filename: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Student",
    }
  );
  return Student;
};
