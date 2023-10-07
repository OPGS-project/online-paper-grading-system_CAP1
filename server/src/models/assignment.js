"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Assignment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Assignment.init(
    {
      assignment_name: DataTypes.STRING,
      start_date: DataTypes.DATE,
      deadline: DataTypes.DATE,
      content_type: DataTypes.ENUM("text", "file"),
      content_text: DataTypes.TEXT,
      file_path: DataTypes.STRING,
      grading_criteria_file: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Assignment",
    }
  );

  return Assignment;
};
