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
      Assignment.belongsTo(models.Class, {
        foreignKey: "of_class",
        targetKey: "id",
        as: "classData",
      });

      Assignment.hasMany(models.Submission, {
        foreignKey: "assignment_id",
        as: "submissionData",
      });
    }
  }
  Assignment.init(
    {
      assignment_name: DataTypes.STRING,
      start_date: DataTypes.DATE,
      deadline: DataTypes.DATE,
      of_class: DataTypes.INTEGER,
      content_text: DataTypes.TEXT,
      file_path: DataTypes.STRING,
      filename: DataTypes.STRING,
      id_teacher: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Assignment",
    }
  );

  return Assignment;
};
