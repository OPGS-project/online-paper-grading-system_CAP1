import { generateRandomString } from '../helpers/idRandom';
import { student_name } from '../helpers/joi_schema';
import db from '../models'
import {Op} from 'sequelize'
const cloudinary = require('cloudinary').v2;

export const getStudentSubmittedById = (assignmentId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Submission.findAll({
        attributes: ["id", "student_id", "assignment_id", "submission_status"],
        where: { assignment_id: assignmentId },
          include: [
            {
              model: db.Student,
              as: "studentData",
              attributes: ["student_name"],
            },
          ],
      });

      //test
      // for (const checkStudentSubmitted of response){
      //     const arrayImages = [checkStudentSubmitted.image];
      //   checkStudentSubmitted.image = checkStudentSubmitted.student_id > 0 ? arrayImages : checkStudentSubmitted.image;
      // }
      //test

      //Lặp qua từng phần tử (submission) của response(tìm kiếm trong db Submission) 
      for (const submission of response) {
        // Kiểm tra xem có mục nào tương ứng trong bảng Grade không
        const gradeEntry = await db.Grade.findOne({
          where: { submission_id: submission.id },
        });

        // Cập nhật submit_status dựa trên kết quả
        submission.submission_status = gradeEntry ? "Đã chấm" : "Chấm bài";
      }

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

// export const getStudentSubmittedById = (assignmentId) =>
//   new Promise(async (resolve, reject) => {
//     try {
//       const response = await db.Submission.findAll({
//         attributes: ["id", "student_id", "assignment_id", "image", "submission_status"],
//         where: { assignment_id: assignmentId },
//         include: [
//           {
//             model: db.Student,
//             as: "studentData",
//             attributes: ["student_name"],
//           },
//         ],
//       });

//       // Tạo một đối tượng để theo dõi các sinh viên đã được gộp
//       const mergedStudents = {};

//       // Lặp qua từng phần tử (submission) của response(tìm kiếm trong db Submission)
//       for (const submission of response) {
//         const studentId = submission.student_id;
//         // Kiểm tra xem sinh viên đã được gộp chưa
//         if (!mergedStudents[studentId]) {
//           // Nếu chưa, thì tạo một bản ghi mới với studentData là mảng
//           mergedStudents[studentId] = {
//             id: submission.id,
//             student_id: studentId,
//             assignment_id: assignmentId,
//             image: submission.image,
//             submission_status: submission.submission_status,
//             studentData: [
//               {
//                 student_name: submission.studentData.student_name,
//               },
//             ],
//           };
//         } else {
//           // Nếu đã được gộp, thêm studentData vào mảng
//           mergedStudents[studentId].studentData.push({
//             student_name: submission.studentData.student_name,
//             // image: submission.image,
//           });
//           // mergedStudents[studentId].image.push({
//           //   image: submission.image,
//           // });
//         }

//         // Kiểm tra xem có mục nào tương ứng trong bảng Grade không
//         const gradeEntry = await db.Grade.findOne({
//           where: { submission_id: submission.id },
//         });

//         // Cập nhật submit_status dựa trên kết quả
//         submission.submission_status = gradeEntry ? "Đã chấm" : "Chấm bài";
//       }

//       // Chuyển đổi đối tượng mergedStudents thành mảng
//       const mergedResponse = Object.values(mergedStudents);

//       resolve({
//         err: mergedResponse.length > 0 ? 0 : 1,
//         message: mergedResponse.length > 0 ? "Got" : "Can not found!!!",
//         response: mergedResponse,
//       });
//     } catch (e) {
//       console.log(e);
//       reject(e);
//     }
//   });

export const get_submission_ById = (assignment_id, studentId) =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await db.Submission.findAll({
            attributes: ["id","student_id", "assignment_id", "image", "createdAt"],
            where: {student_id: studentId, assignment_id:  assignment_id},
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








