"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Grade extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Grade.belongsTo(models.Submission, {
        foreignKey: 'submission_id',
        as: "submissionData",
      });
      Grade.belongsTo(models.Student, {
        foreignKey: 'student_id',
        as: "studentData",
      });
    }
  }
  Grade.init(
    {
      student_id:DataTypes.INTEGER,
      submission_id: DataTypes.INTEGER,
      score_value: DataTypes.FLOAT,
      comments: DataTypes.TEXT,
      image: DataTypes.STRING,
      canvas_json: DataTypes.JSON,
      filename: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Grade",
    }
  );

  return Grade;
};
