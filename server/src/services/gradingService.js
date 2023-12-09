import db from '../models'
import {Op} from 'sequelize'
const cloudinary = require('cloudinary').v2;

//CREATE
export const saveGradedAssignments = (body, fileData) => new Promise(async (resolve, reject) => {
  try {
      const response = await db.Grade.create({
        submission_id: body.submission_id,
        score_value: body.score_value,
        comments: body.comments,
        image: fileData?.path,
        filename: fileData?.filename,
      });

      resolve({
          err: response ? 0 : 1,
          mes: response ? 'Save the graded assignment successfully' : 'Save failed graded assignments',
      });

      if (fileData && !response) {
          // Only destroy the image if the submission was not successfully created
          cloudinary.uploader.destroy(fileData.filename);
      }
  } catch (error) {
      reject(error);
  }
});

export const getGradeById = (submissionId, student_name) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Grade.findAll({
        attributes: ["score_value", "comments", "image"],
        where: { submission_id: submissionId },
          include: [
            {
              model: db.Submission,
              as: "submissionData",
              attributes: ["image", "student_id"],
              include: [
                {
                  model: db.Assignment,
                  as: "assignmentData",
                  attributes: ["assignment_name"],
                },
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

  