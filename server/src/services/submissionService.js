import { generateRandomString } from '../helpers/idRandom';
import db from '../models'
import {Op} from 'sequelize'
const cloudinary = require('cloudinary').v2;

export const getSubmission = ({
    page,
    limit,
    order,
    // name,
    submission_id,
  
    ...query
  }) =>
    new Promise(async (resolve, reject) => {
      try {
        const queries = { raw: false, nest: true };
        // const offset = !page || +page <= 1 ? 0 : +page - 1;
        // const fLimit = +limit || +process.env.LIMIT_NUMBER;
        // queries.offset = offset * fLimit;
        // queries.limit = fLimit;
        if (order) queries.order = [order];
        // if (name) query.assignment_name = { [Op.substring]: name };
        const response = await db.Submission.findAndCountAll({
          where: submission_id ? { id: submission_id } : {},
          // where: query,
          ...queries,
          order: [["id", "DESC"]],
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              model: db.Grade,
              as: "gradeData",
              attributes: ["score_value"],
            },
          ],
        });
        resolve({
          err: response ? 0 : 1,
          message: response ? "Got" : "Can not found!!!",
          submission: response,
          count: response.count,
        });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });

export const getSubmissionById = (assignment_id) =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await db.Assignment.findAll({
          where: { id: assignment_id },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              model: db.Submission,
              as: 'submissionData',
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },

            },
              // {
              //   model: db.Class,
              //   as:'classData'
              // }
          ],
        });
        resolve({
          err: response ? 0 : 1,
          message: response ? "Got" : "Can not found!!!",
          assignment: response,
          response: response.rows,
          count: response.count,

        });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });

// export const getSubmissionByStudentId = (student_id, class_id, assignment_id) =>
//   new Promise(async (resolve, reject) => {
//     try {
//       console.log(student_id);
//       console.log(assignment_id);
//       console.log(class_id);
//       const response = await db.Assignment.findAll({       
//         where: { id: assignment_id },
//         attributes: {
//           exclude: ["createdAt", "updatedAt"],
//         },
//         include: [
//           {
//             model: db.Submission,
//             as: 'submissionData',
//             where: { student_id: student_id, class_id: class_id }, // Add this condition
//           },
//           {
//             model: db.Class,
//             as: 'classData',
//           },
//         ],
//       });

//       resolve({
//         err: response ? 0 : 1,
//         message: response ? "Got" : "Cannot be found!!!",
//         assignment: response,
//         response: response.rows,
//         count: response.count,
//       });
//     } catch (e) {
//       console.log(e);
//       reject(e);
//     }
//   });

//CREATE
// export const uploadSubmission = ( body, fileData ) => new Promise(async (resolve, reject) => {
//   try {
//       // console.log(userId);

//       const response = await db.Submission.create({
//           ...body,
//           image: fileData?.path,
//           filename: fileData?.filename,
//           // class_id: body.class_id,
//           // student_id: body.student_id,
//           // assignment_id: body.assignment_id,
//       });

//       console.log(response);

//           if (fileData && !response) {
//               // Only destroy the image if the submission was not successfully created
//               await cloudinary.uploader.destroy(fileData.filename);
//           }

//           resolve({
//               err: response ? 0 : 1,
//               mes: response ? 'Upload submission' : 'Cannot upload submission',
//           });

//       } catch (error) {
//           reject(error);

//           if (fileData) {
//               // Destroy the image in case of an error
//               await cloudinary.uploader.destroy(fileData.filename);
//           }
//       }
//   }
// );

export const uploadSubmission = async (body, fileData, id) => {
  return new Promise(async (resolve, reject) => {
      try {
          const response = await db.Submission.create({
              ...body,
              student_id : id,
              image: fileData?.path,
              filename: fileData?.filename,
              submission_status: "Đã nộp"
          });
          if (fileData && !response[0] === 0) {
              // Only destroy the image if the submission was not successfully created
               cloudinary.uploader.destroy(fileData.filename);
          }
          resolve({
              err: response ? 0 : 1,
              mes: response ? 'Upload submission' : 'Cannot upload submission',
          });

      } catch (error) {
          reject(error);

          if (fileData) {
              // Destroy the image in case of an error
              await cloudinary.uploader.destroy(fileData.filename);
          }
      }
  });
};


