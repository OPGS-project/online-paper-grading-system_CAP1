"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Short-Assignments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      assignment_name: {
        type: Sequelize.STRING,
      },
      id_teacher: {
        type: Sequelize.STRING,
      },
      question_name: {
        type: Sequelize.JSON,
      },
      answer_file: {
        type: Sequelize.STRING,
      },
      ckeditor_settings: {
        type: Sequelize.JSON,
      },
      createdAt: {
        allowNull: false,
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Short-Assignments");
  },
};