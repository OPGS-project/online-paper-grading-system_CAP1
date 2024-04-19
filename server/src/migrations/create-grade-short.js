"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Grade_shorts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      submission_id: {
        type: Sequelize.INTEGER,
      },
      student_id: {
        type: Sequelize.INTEGER,
      },
      score_value: {
        type: Sequelize.FLOAT,
      },
      comments: {
        type: Sequelize.TEXT,
      },
      answer_short_json:{
        type: Sequelize.JSON
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
    await queryInterface.dropTable("Grade_shorts");
  },
};
