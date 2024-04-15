import { classID, id } from "../helpers/joi_schema";
import db from "../models";
import { Op } from "sequelize";

//READ
export const getClasses = (tid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Class.findAndCountAll({
        where: { id_teacher: tid },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: db.Student,
            as: "studentData",
            attributes: ["student_name"],
          },
        ],
      });

      resolve({
        err: response ? 0 : 1,
        message: response ? "Got" : "Can not found!!!",
        classData: response,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });

//getStudentbyIdClass

export const getStudentByClassId = (classID) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.Class.findAndCountAll({
        where: { id: classID },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: db.Student,
            as: "studentData",
            attributes: [
              "id",
              "student_name",
              "gender",
              "phone",
              "address",
              "birthday",
              "username",
              "password",
            ],
          },
        ],
      });
      resolve({
        success: response ? true : false,
        mess: response ? "Get data success" : "Get data failure",
        response: response.rows,
        count: response.count,
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getClassById = (classID) =>
  new Promise(async (resolve, reject) => {
    try {
      const queries = { raw: true, nest: true };

      const response = await db.Class.findOne({
        where: { id: classID }, // Sử dụng classID để tìm lớp học theo ID
        ...queries,
      });
      if (response) {
        resolve({
          err: 0,
          mes: "Got",
          classData: response,
        });
      } else {
        resolve({
          err: 1,
          mes: "Cannot find class",
          classData: null,
        });
      }
    } catch (error) {
      reject(error);
    }
  });

//CREATE
export const createNewClass = (body, tid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Class.findOrCreate({
        where: { class_name: body?.class_name },
        defaults: { ...body, id_teacher: tid },
      });
      // console.log(response);
      resolve({
        err: response[1] ? 0 : 1,
        mes: response[1] ? "Created" : "Cannot create class",
      });
    } catch (error) {
      reject(error);
    }
  });

//UPDATE
export const updateClass = (classID, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Class.update(body, {
        where: { id: classID },
      });

      resolve({
        err: response[0] > 0 ? 0 : 1,
        mes:
          response[0] > 0
            ? `${response[0]} class updated`
            : "Cannot update class/ ClassID not found",
      });
    } catch (error) {
      reject(error);
    }
  });

//DELETE
export const deleteClass = (classID) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Class.destroy({
        where: { id: classID },
      });
      resolve({
        err: response > 0 ? 0 : 1,
        mes: `${response} class deleted`,
      });
    } catch (error) {
      reject(error);
    }
  });
