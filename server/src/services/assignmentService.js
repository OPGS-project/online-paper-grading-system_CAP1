import db from "../models";
import { Op } from "sequelize";
// import { v4 as generateId } from "uuid";
// const cloudinary = require("cloudinary").v2;

export const getAssignment = ({
  page,
  limit,
  order,
  name,

  ...query
}) =>
  new Promise(async (resolve, reject) => {
    try {
      const queries = { raw: false, nest: true };
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const fLimit = +limit || +process.env.LIMIT_NUMBER;
      queries.offset = offset * fLimit;
      queries.limit = fLimit;
      if (order) queries.order = [order];
      if (name) query.assignment_name = { [Op.substring]: name };
      const response = await db.Assignment.findAndCountAll({
        where: query,
        ...queries,
        attributes: {
          exclude: ["createdAt	", "updatedAt"],
        },
        include: [
          {
            model: db.Events,
            as: "criteriaData",
            attributes: ["of_assignment", "correct_answer", "max_score"],
          },
        ],
      });

      resolve({
        err: response ? 0 : 1,
        message: response ? "Got" : "Can not found!!!",
        assignmentData: response,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });

export const getAssignmentById = (assignmentId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Assignment.findOne({
        where: { id: assignmentId },
      });

      resolve({
        err: response ? 0 : 1,
        message: response ? "Got" : "Can not found!!!",
        response,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });

//CREATE
export const createAssignment = (body) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log(body);
      const response = await db.Assignment.findOrCreate({
        where: { assignment_name: body?.assignment_name },
        defaults: body,
      });

      resolve({
        err: response[1] ? 0 : 1,
        mes: response[1] ? "OK" : "Can not create Assignment!!!",
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
//UPDATE
export const updateAssignment = (assignmentId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Assignment.update(body, {
        where: { id: assignmentId },
      });

      resolve({
        err: response[0] > 0 ? 0 : 1,
        message:
          response[0] > 0
            ? `${response} assignment updated`
            : "Can not update Assignment!!!",
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
//DELETE
export const deleteAssignment = (assignmentId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Assignment.destroy({
        where: { id: assignmentId.assignmentId },
      });

      resolve({
        err: response > 0 ? 0 : 1,
        message: `${response} assignment deleted`,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
