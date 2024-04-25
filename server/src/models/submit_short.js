"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Submit_short extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Submit_short.hasOne(models.Grade_short, {
        foreignKey: "submission_id",
        as: "gradeData",
      });
      Submit_short.belongsTo(models.Class, {
        foreignKey: "class_id",
        targetKey: "id",
        as: "classData",
      });
      Submit_short.belongsTo(models.Assignment, {
        foreignKey: "assignment_id",
        as: "assignmentData",
      });
      Submit_short.belongsTo(models.Student, {
        foreignKey: "student_id",
        as: "studentData",
      })
    }
  }
  Submit_short.init(
    {
      class_id: DataTypes.INTEGER,
      student_id: DataTypes.INTEGER,
      assignment_id: DataTypes.INTEGER,
      submission_time: DataTypes.DATE,
      submission_status: DataTypes.STRING,
      answer_short:DataTypes.JSON  
    },
    {
      sequelize,
      modelName: "Submit_short",
    }
  );

  return Submit_short;
};
