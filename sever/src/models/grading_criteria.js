"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Grading_Criteria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Grading_Criteria.init(
    {
      question_number: DataTypes.STRING,
      correct_answer: DataTypes.TEXT,
      max_score: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Grading_Criteria",
    }
  );

  return Grading_Criteria;
};
