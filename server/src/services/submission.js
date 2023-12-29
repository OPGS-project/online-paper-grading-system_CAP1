import { generateRandomString } from '../helpers/idRandom';
import { student_name } from '../helpers/joi_schema';
import db from '../models'
import {Op} from 'sequelize'
const cloudinary = require('cloudinary').v2;

//Cũ
// export const getStudentSubmittedById = (assignmentId) =>
//   new Promise(async (resolve, reject) => {
//     try {
//       const response = await db.Submission.findAll({
//         attributes: ["id", "student_id", "assignment_id", "submission_status", "image"],
//         where: { assignment_id: assignmentId },
//           include: [
//             {
//               model: db.Student,
//               as: "studentData",
//               attributes: ["student_name"],
//             },
//           ],
//       });

//       //test
//       // for (const checkStudentSubmitted of response){
//       //     const arrayImages = [checkStudentSubmitted.image];
//       //   checkStudentSubmitted.image = checkStudentSubmitted.student_id > 0 ? arrayImages : checkStudentSubmitted.image;
//       // }
//       //test

//       //Lặp qua từng phần tử (submission) của response(tìm kiếm trong db Submission) 
//       for (const submission of response) {
//         // Kiểm tra xem có mục nào tương ứng trong bảng Grade không
//         const gradeEntry = await db.Grade.findOne({
//           where: { submission_id: submission.id },
//         });

//         // Cập nhật submit_status dựa trên kết quả
//         submission.submission_status = gradeEntry ? "Đã chấm" : "Chấm bài";
//       }

//       resolve({
//         err: response ? 0 : 1,
//         message: response ? "Got" : "Can not found!!!",
//         response,
//       });
//     } catch (e) {
//       console.log(e);
//       reject(e);
//     }
//   });

export const getStudentSubmittedById = (assignmentId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Submission.findAll({
        attributes: ["id", "student_id", "assignment_id", "submission_status", "image"],
        where: { assignment_id: assignmentId },
        include: [
          {
            model: db.Student,
            as: "studentData",
            attributes: ["student_name"],
          },
        ],
      });

      // Tạo một đối tượng để theo dõi học sinh đã xuất hiện
      const studentMap = {};

      for (const submission of response) {
        const studentId = submission.student_id;

        // Nếu học sinh đã xuất hiện trong đối tượng, gộp thông tin
        if (studentMap[studentId]) {
          studentMap[studentId].image.push(submission.image);
        } else {
          // Nếu học sinh chưa xuất hiện, thêm mới vào đối tượng
          studentMap[studentId] = {
            id: submission.id,
            student_id: studentId,
            assignment_id: submission.assignment_id,
            student_name: submission.studentData.student_name,
            submission_status: submission.submission_status,
            image: [submission.image], // Sử dụng mảng để lưu trữ nhiều hình ảnh
          };
        }

        // Kiểm tra xem có mục nào tương ứng trong bảng Grade không
        const gradeEntry = await db.Grade.findOne({
          where: { submission_id: submission.id },
        });

        // Cập nhật submit_status dựa trên kết quả
        studentMap[studentId].submission_status = gradeEntry ? "Đã chấm" : "Chấm bài";
      }

      // Chuyển đối tượng thành mảng
      const mergedResponse = Object.values(studentMap);

      resolve({
        err: mergedResponse ? 0 : 1,
        message: mergedResponse ? "Got" : "Can not found!!!",
        response: mergedResponse,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });

//Cũ
// export const get_submission_ById = (assignment_id, studentId) =>
//     new Promise(async (resolve, reject) => {
//       try {
//         const response = await db.Submission.findAll({
//             attributes: ["id","student_id", "assignment_id", "image", "createdAt"],
//             where: {student_id: studentId, assignment_id:  assignment_id},
//             include: [
//             {
//                 model: db.Student,
//                 attributes: ["student_name"],
//                 as: "studentData", // Bí danh cho mối quan hệ
//             },
//             {
//                 model: db.Class,
//                 attributes: ["class_name"],
//                 as: "classData", // Bí danh cho mối quan hệ
//             },
//             {
//                 model: db.Assignment,
//                 attributes: ["file_path"],
//                 as: "assignmentData", // Bí danh cho mối quan hệ
//             },
//         ],
//         });
//         resolve({
//           err: response ? 0 : 1,
//           message: response ? "Oke" : "Can not found!!!",
//           response,
//         });
//       } catch (e) {
//         console.log(e);
//         reject(e);
//       }
//     });

export const get_submission_ById = (assignment_id, studentId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Submission.findAll({
        attributes: ["id", "student_id", "assignment_id", "image", "createdAt"],
        where: { student_id: studentId, assignment_id: assignment_id },
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

      // Tạo một đối tượng để theo dõi học sinh đã xuất hiện cho từng cặp assignment_id và student_id
      const submissionMap = {};

      for (const submission of response) {
        const key = `${submission.assignment_id}_${submission.student_id}`;

        // Nếu đã xuất hiện, gộp thông tin
        if (submissionMap[key]) {
          submissionMap[key].image.push(submission.image);
        } else {
          // Nếu chưa xuất hiện, thêm mới vào đối tượng
          submissionMap[key] = {
            id: submission.id,
            student_id: submission.student_id,
            assignment_id: submission.assignment_id,
            createdAt: submission.createdAt,
            studentData: {
              student_name: submission.studentData.student_name,
            },
            classData: {
              class_name: submission.classData.class_name,
            },
            assignmentData: {
              file_path: submission.assignmentData.file_path,
            },
            image: [submission.image], // Sử dụng mảng để lưu trữ nhiều hình ảnh
          };
        }
      }

      // Chuyển đối tượng thành mảng
      const mergedResponse = Object.values(submissionMap);

      resolve({
        err: mergedResponse ? 0 : 1,
        message: mergedResponse ? "Oke" : "Can not found!!!",
        response: mergedResponse,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });








