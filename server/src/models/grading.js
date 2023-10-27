"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Grading extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Grading.init(
    {
      submission_id: DataTypes.INTEGER,
      criteria_id: DataTypes.INTEGER,
      selected_area: DataTypes.STRING,
      score_value: DataTypes.FLOAT,
      comments: DataTypes.TEXT,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Grading",
    }
  );

  return Grading;
};
