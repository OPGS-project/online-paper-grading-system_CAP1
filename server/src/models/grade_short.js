"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Grade_short extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Grade_short.belongsTo(models.Submit_short, {
        foreignKey: 'submission_id',
        as: "submissionData",
      });
      Grade_short.belongsTo(models.Student, {
        foreignKey: 'student_id',
        as: "studentData",
      });
    }
  }
  Grade_short.init(
    {
      student_id:DataTypes.INTEGER,
      submission_id: DataTypes.INTEGER,
      score_value: DataTypes.FLOAT,
      comments: DataTypes.TEXT,
      answer_short_json:DataTypes.JSON
    },
    {
      sequelize,
      modelName: "Grade_short",
    }
  );

  return Grade_short;
};
