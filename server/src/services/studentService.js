import db from "../models";
import { Op } from "sequelize";
// import { v4 as generateId } from "uuid";
// const cloudinary = require("cloudinary").v2;

export const getStudent = ({
  page,
  limit,
  order,
  name,

  ...query
}) =>
  new Promise(async (resolve, reject) => {
    try {
      const queries = { raw: true, nest: true };
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const fLimit = +limit || +process.env.LIMIT_NUMBER;
      queries.offset = offset * fLimit;
      queries.limit = fLimit;
      if (order) queries.order = [order];
      if (name) query.student_name = { [Op.substring]: name };
      const response = await db.Student.findAndCountAll({
        where: query,
        ...queries,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: db.Assignment,
            as: "assignmentData",
            attributes: {
              exclude: ["of_class", "createdAt", "updatedAt"],
            },
          },
        ],
      });

      resolve({
        err: response ? 0 : 1,
        message: response ? "Got" : "Can not found!!!",
        student: response,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });

//CREATE
export const createStudent = (body) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Student.findOrCreate({
        where: { student_name: body?.student_name },
        defaults: body,
      });

      resolve({
        err: response[1] ? 0 : 1,
        mes: response[1] ? "OK" : "Can not create Student!!!",
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
// UPDATE
export const updateStudent = (studentId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Student.update(body, {
        where: { id: studentId },
      });

      resolve({
        err: response[0] > 0 ? 0 : 1,
        message:
          response[0] > 0
            ? `${response} student updated`
            : "Can not update student!!!",
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
//DELETE
export const deleteStudent = (studentId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Student.destroy({
        where: { id: studentId },
      });

      resolve({
        err: response > 0 ? 0 : 1,
        message: `${response} student deleted`,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
