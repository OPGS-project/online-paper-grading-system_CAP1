import { of_class } from "../helpers/joi_schema";
import db from "../models";
import { Op } from "sequelize";
// import { v4 as generateId } from "uuid";
const cloudinary = require("cloudinary").v2;

const mime = require("mime-types");

export const getAssignment = (tid) =>
  new Promise(async (resolve, reject) => {
    try {
      // if (name) query.assignment_name = { [Op.substring]: name };

      const response = await db.Assignment.findAndCountAll({
        where: { id_teacher: tid },
        order: [["id", "DESC"]],
        attributes: {
          exclude: ["createdAt	", "updatedAt"],
        },
        include: [
          {
            model: db.Class,
            as: "classData",
            attributes: ["class_name"],
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

//get ass

export const getAssignmentById = (assignmentId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Assignment.findAll({
        where: { id: assignmentId },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: db.Class,
            as: "classData",
            attributes: ["class_name"],
            include: [
              {
                model: db.Student,
                as: "studentData",
                attributes: ["student_name"],
              },
            ],
          },
        ],
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
export const createAssignment = (body, fileData, tid) =>
  new Promise(async (resolve, reject) => {
    // console.log(fileData);
    try {
      if (fileData) {
        body.file_path = fileData?.path;
        body.filename = fileData?.filename;
      }
      const dataClass = await db.Class.findOne({
        where: { class_name: body.of_class },
      });
      // console.log(dataClass);
      const response = await db.Assignment.findOrCreate({
        where: { assignment_name: body?.assignment_name },
        defaults: {
          ...body,
          id_teacher: tid,
          of_class: dataClass.dataValues.id,
        },
      });
      if (fileData && !response[0] === 0)
        cloudinary.uploader.destroy(fileData.filename);
      resolve({
        err: response[1] ? 0 : 1,
        mes: response[1] ? "OK" : "Can not create file pdf Assignment!!!",
      });
    } catch (e) {
      // console.log(e);
      reject(e);
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
  });

//UPDATE
export const updateAssignment = (assignmentId, body, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      const filePDF = await db.Assignment.findOne({
        where: { id: assignmentId },
      });
      if (filePDF)
        cloudinary.api.delete_resources(filePDF[0].dataValues.filename);
      if (fileData) {
        body.file_path = fileData?.path;
        body.filename = fileData?.filename;
      }
      const dataClass = await db.Class.findOne({
        where: { class_name: body.of_class },
      });
      const response = await db.Assignment.update(
        { ...body, of_class: dataClass.dataValues.id },
        {
          where: {
            id: assignmentId.assignmentId,
          },
        }
      );
      resolve({
        err: response[0] > 0 ? 0 : 1,
        message:
          response[0] > 0
            ? `${response} assignment updated`
            : "Can not update Assignment!!!",
      });
      if (fileData && !response[0] === 0)
        cloudinary.uploader.destroy(fileData.filename);
    } catch (e) {
      console.log(e);
      reject(e);
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
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
