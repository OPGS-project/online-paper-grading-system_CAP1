"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Submission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Submission.hasOne(models.Grade, {
        foreignKey: "submission_id",
        as: "gradeData",
      });
      Submission.belongsTo(models.Class, {
        foreignKey: "class_id",
        targetKey: "id",
        as: "classData",
      });
      Submission.belongsTo(models.Assignment, {
        foreignKey: "assignment_id",
        as: "assignmentData",
      });
      Submission.belongsTo(models.Student, {
        foreignKey: "student_id",
        as: "studentData",
      })
    }
  }
  Submission.init(
    {
      class_id: DataTypes.INTEGER,
      student_id: DataTypes.INTEGER,
      student_name: DataTypes.STRING,
      assignment_id: DataTypes.INTEGER,
      submission_time: DataTypes.DATE,
      submission_status: DataTypes.STRING,
      image: DataTypes.STRING,
      filename: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Submission",
    }
  );

  return Submission;
};
