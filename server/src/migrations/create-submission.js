"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Submissions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      class_id: {
        type: Sequelize.INTEGER,
      },
      student_id: {
        type: Sequelize.INTEGER,
      },
      student_name: {
        type: Sequelize.STRING,
      },
      assignment_id: {
        type: Sequelize.INTEGER,
      },
      submission_time: {
        type: Sequelize.DATE,
      },
      submission_status: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      filename: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Submissions");
  },
};
