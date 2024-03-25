"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Short_assignment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Short_assignment.belongsTo(models.Class, {
        foreignKey: "of_class",
        targetKey: "id",
        as: "classData",
      });

    //   Assignment.hasMany(models.Submission, {
    //     foreignKey: "assignment_id",
    //     as: "submissionData",
    //   });
    }
  }
  Short_assignment.init(
    {
      assignment_name: DataTypes.STRING,
      id_teacher: DataTypes.STRING,
      question_name:DataTypes.JSON,
      of_class: DataTypes.INTEGER,
      answer_file:DataTypes.STRING,
      ckeditor_settings:DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "Short_assignment",
    }
  );
  console.log('Đã vào model short_assignment aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  return Short_assignment;
};
