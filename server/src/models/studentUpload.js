const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Student extends Model {
    static associate(models) {
      // define association here
      Student.hasMany(models.Assignment, {
        foreignKey: "class_id",
        as: "assignmentData",
      });
    }

    // Explicitly define the create method
    static async createStudent({
      class_id,
      student_name,
      phone,
      gender,
      birthday,
      address,
      email,
    }) {
      return await this.create({
        class_id,
        student_name,
        phone,
        gender,
        birthday,
        address,
        email,
      });
    }
  }

  Student.init(
    {
      class_id: DataTypes.STRING,
      student_name: DataTypes.STRING,
      phone: DataTypes.STRING,
      gender: DataTypes.STRING,
      birthday: DataTypes.DATE,
      address: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Student",
    }
  );

  return Student;
};
