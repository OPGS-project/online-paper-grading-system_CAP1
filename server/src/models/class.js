"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Class.hasMany(models.Student, {
        foreignKey: "class_id",
        as: "studentData",
      });
      Class.hasMany(models.Assignment, {
        foreignKey: "of_class",
        as: "assignmentData",
      });
      // Class.belongsTo(models.Student_Class, {
      //   foreignKey: "id",
      //   targetKey: "class_id",
      //   as: "classData",
      // });
      Class.belongsToMany(models.Student, {
        through: "Student_Class",
        foreignKey: "class_id",
      });
    }
  }
  Class.init(
    {
      class_name: DataTypes.STRING,
      state: DataTypes.STRING,
      total_students: DataTypes.INTEGER,
      content: DataTypes.STRING,
      id_teacher: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Class",
    }
  );

  return Class;
};
