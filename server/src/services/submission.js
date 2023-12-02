import { generateRandomString } from '../helpers/idRandom';
import { student_name } from '../helpers/joi_schema';
import db from '../models'
import {Op} from 'sequelize'
const cloudinary = require('cloudinary').v2;

export const getStudentSubmittedById = (assignmentId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Submission.findAll({
        attributes: ["student_id", "assignment_id", "submission_status"],
        where: { assignment_id: assignmentId },
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
        response,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });

export const get_submission_ById = (studentId) =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await db.Submission.findAll({
            attributes: ["image", "createdAt","id","assignment_id"],
            where: {student_id: studentId },
            include: [
            {
                model: db.Student,
                attributes: ["student_name"],
                as: "studentData", // Bí danh cho mối quan hệ
            },
            {
                model: db.Class,
                attributes: ["class_name"],
                as: "classData", // Bí danh cho mối quan hệ
            },
            {
                model: db.Assignment,
                attributes: ["file_path"],
                as: "assignmentData", // Bí danh cho mối quan hệ
            },
        ],
        });
        resolve({
          err: response ? 0 : 1,
          message: response ? "Oke" : "Can not found!!!",
          response,
        });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });








