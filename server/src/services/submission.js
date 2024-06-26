import { generateRandomString } from "../helpers/idRandom";
import { student_name } from "../helpers/joi_schema";
import db from "../models";
import { Op } from "sequelize";
import grade from "../models/grade";
const cloudinary = require("cloudinary").v2;

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
        attributes: [
          "id",
          "student_id",
          "assignment_id",
          "submission_status",
          "image",
          "createdAt",
          "class_id",
        ],
        where: { assignment_id: assignmentId },
        include: [
          {
            model: db.Student,
            as: "studentData",
            attributes: ["student_name"],
          },
          {
            model: db.Grade,
            as: "gradeData",
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
            createdAt: submission.createdAt,
            class_id: submission.class_id,
            image: [submission.image], // Sử dụng mảng để lưu trữ nhiều hình ảnh
            gradeData: submission.gradeData,
          };
        }

        // Kiểm tra xem có mục nào tương ứng trong bảng Grade không
        const gradeEntry = await db.Grade.findOne({
          where: { submission_id: submission.id },
        });

        // Cập nhật submit_status dựa trên kết quả
        studentMap[studentId].submission_status = gradeEntry
          ? "Đã chấm"
          : "Chấm bài";
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
            attributes: ["file_path", "assignment_name"],
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
              assignment_name: submission.assignmentData.assignment_name,
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



// get submit short
export const getSubmitShortService =(assignment_id) =>{
  return new Promise(async(resolve,reject) =>{
    try {
      const response = await db.Submit_short.findAll({
        where: { assignment_id: assignment_id },
        attributes: [
          "id",
          "student_id",
          "assignment_id",
          "submission_status",
          "answer_short",
          "createdAt",
          "class_id",
        ],
        include: [
          {
            model: db.Student,
            as: "studentData",
            attributes: ["student_name"],
          },
          {
            model: db.Grade_short,
            as: "gradeData",
          },
        ],
      });

      // Tạo một đối tượng để theo dõi học sinh đã xuất hiện
      const studentMap = {};

      for (const submit of response) {
        const studentId = submit.student_id;
     

        // Nếu học sinh đã xuất hiện trong đối tượng, gộp thông tin
        if (studentMap[studentId]) {
          studentMap[studentId].answer_short.push(submit.answer_short);
        } else {
          // Nếu học sinh chưa xuất hiện, thêm mới vào đối tượng
          studentMap[studentId] = {
            id: submit.id,
            student_id: studentId,
            assignment_id: submit.assignment_id,
            student_name: submit.studentData.student_name,
            submission_status: submit.submission_status,
            createdAt: submit.createdAt,
            class_id: submit.class_id,
            answer_short: [submit.answer_short],
            gradeData: submit.gradeData,
          };
        }

        // Kiểm tra xem có mục nào tương ứng trong bảng Grade không
        const gradeEntry = await db.Grade_short.findOne({
          where: { submission_id: submit.id },
        });

        // Cập nhật submit_status dựa trên kết quả
        studentMap[studentId].submission_status = gradeEntry
          ? "Đã chấm"
          : "Chấm bài";
      }

      // Chuyển đối tượng thành mảng
      const mergedResponse = Object.values(studentMap);
      console.log(response)
      resolve({
        err: mergedResponse ? 0 : 1,
        message: mergedResponse ? "Ok" : "Can not found!!!",
        response: mergedResponse,
      });
        
    } catch (error) {
        reject(error)
    }
  })
}
export const getSubmitGradingShortService = (assignment_id,studentId) =>{
  return new Promise(async(resolve,reject) =>{
    try {
      const response = await db.Submit_short.findAll({
        attributes: ["id", "student_id", "assignment_id", "answer_short", "submission_time"],
       
        where: { student_id: studentId, assignment_id: assignment_id },
        include: [
          {
            model: db.Student,
            attributes: ["student_name"],
            as: "studentData", 
          },
          {
            model: db.Class,
            attributes: ["class_name"],
            as: "classData", 
          },
          {
            model: db.Assignment,
            attributes: ["assignment_name"],
            as: "assignmentData", 
          },
        ],
      });

       // Tạo một đối tượng để theo dõi học sinh đã xuất hiện cho từng cặp assignment_id và student_id
       const submissionMap = {};

       for (const submission of response) {
         const key = `${submission.assignment_id}_${submission.student_id}`;
 
         // Nếu đã xuất hiện, gộp thông tin
         if (submissionMap[key]) {
           submissionMap[key].answer_short.push(submission.answer_short);
         } else {
           // Nếu chưa xuất hiện, thêm mới vào đối tượng
           submissionMap[key] = {
            id: submission.id,
            student_id: submission.student_id,
            assignment_id: submission.assignment_id,
            submission_time: submission.submission_time,
            student_name: submission.studentData.student_name,
            class_name: submission.classData.class_name,
            assignment_name: submission.assignmentData.assignment_name,
            answer_short: [JSON.parse(submission.answer_short)], 
           };
         }
       }
      // console.log(response.answer_short)
      //Chuyển đối tượng thành mảng
      const mergedResponse = Object.values(submissionMap);
      console.log("merge",mergedResponse)
      console.log(response)
      resolve({
        errCode:mergedResponse ? 0 : 1,
        message: mergedResponse ? "Okeeeeee!" : "Can not found!!!",
        response: mergedResponse,
      })
    } catch (error) {
        reject(error)
    }
  })
}
