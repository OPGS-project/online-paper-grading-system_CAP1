"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Student_Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student_Class.belongsTo(models.Class, {
        foreignKey: "class_id",
        as: "classData",
      });
      Student_Class.belongsTo(models.Student, {
        foreignKey: "student_id",
        as: "studentData",
      });
    }
  }
  Student_Class.init(
    {
      class_id: DataTypes.INTEGER,
      student_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Student_Class",
    }
  );
  return Student_Class;
};
