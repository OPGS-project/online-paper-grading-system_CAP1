import db from "../models";
import { Op } from "sequelize";
const cloudinary = require("cloudinary").v2;

//CREATE
export const saveGradedAssignments = (body, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Grade.create({
        student_id: body.student_id,
        submission_id: body.submission_id,
        score_value: body.score_value,
        comments: body.comments,
        image: fileData?.path,
        canvas_json: body.canvas_json,
        filename: fileData?.filename,
      });
      // console.log(response);
      resolve({
        err: response ? 0 : 1,
        mes: response
          ? "Save the graded assignment successfully"
          : "Save failed graded assignments",
      });

      if (fileData && !response) {
        // Only destroy the image if the submission was not successfully created
        cloudinary.uploader.destroy(fileData.filename);
      }
    } catch (error) {
      reject(error);
    }
  });

  // short
  export const saveGradedAssignmentShortService = (body) =>
  new Promise(async (resolve, reject) => {
    try {
     
      const response = await db.Grade_short.create({
        student_id: body.student_id,
        submission_id: body.submission_id,
        score_value: body.score_value,
        comments:body.comments,
        answer_short_json:body.answer_short_json,
        // points:JSON.stringify(body.points)
      });
      console.log("point:",body.points)
      resolve({
        err: response ? 0 : 1,
        mes: response
          ? "Lưu bài tập đã chấm thành công"
          : "Lưu bài tập đã chấm thất bại",
          response:response
      });
    } catch (error) {
      reject(error);
    }
  });


export const getGradeById = (idStudent) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Grade.findAll({
        attributes: ["score_value", "comments", "image"],
        where: { student_id: idStudent },
        include: [
          {
            model: db.student,
            attributes: ["student_id"],

            model: db.Submission,
            as: "submissionData",
            attributes: ["image"],
            include: [
              {
                model: db.Assignment,
                as: "assignmentData",
                attributes: ["assignment_name"],
              },
              {
                model: db.Student,
                as: "studentData",
                attributes: ["student_name", "id"],
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


  // export const getGradedForStudentService = (idStudent) =>
  // new Promise(async (resolve, reject) => {
  //   try {
  //     console.log(db.Grade_short)
  //     const response = await db.Grade_short.findAll({
  //       where: { student_id: idStudent },
  //       attributes: ["student_id","score_value", "comments", "answer_short_json", "points" ],
  //       include: [
  //         {
  //           model: db.Submit_short,
  //           as: "submissionData",
  //           attributes: ["answer_short"],
  //           include: [
  //             {
  //               model: db.Assignment,
  //               as: "assignmentData",
  //               attributes: ["assignment_name"],
                
  //             },
  //             {
  //               model: db.Student,
  //               as: "studentData",
  //               attributes: ["student_name", "id"],
  //             },
  //           ],
  //         },
  //       ],
  //     });
  //     console.log("res", response);
  //     resolve({
  //       err: response ? 0 : 1,
  //       message: response ? "Success!" : "No data found!!!",
  //       response: response,
  //     });
  //   } catch (e) {
  //     console.log(e);
  //     reject(e);
  //   }
  // });



export const getGrade = (submissionId, student_name) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Grade.findAll({
        attributes: ["id","student_id", "createdAt", "score_value", "comments", "image", "canvas_json"],
        where: { submission_id: submissionId },
        include: [
          {
            model: db.Submission,
            as: "submissionData",
            attributes: ["image", "student_id", "createdAt"],
            include: [
              {
                model: db.Assignment,
                as: "assignmentData",
                attributes: ["id", "assignment_name", "file_path"],
              },
              {
                model: db.Student,
                as: "studentData",
                attributes: ["student_name"],
              },
              {
                model: db.Class,
                as: "classData",
                attributes: ["class_name"],
              },
            ],
          },
        ],
      });

      // Tạo một đối tượng để theo dõi học sinh đã xuất hiện cho từng cặp assignment_id và student_id
      const gradingMap = {};

      for (const grading of response) {
        const key = `${grading.submission_id}`;

        // Nếu đã xuất hiện, gộp thông tin
        if (gradingMap[key]) {
          gradingMap[key].image.push(grading.image);
        } else {
          // Nếu chưa xuất hiện, thêm mới vào đối tượng
          gradingMap[key] = {
            id: grading.id,
            student_id: grading.student_id,
            createdAt: grading.createdAt,
            score_value: grading.score_value,
            comments: grading.comments,
            image: [grading.image],
            canvas_json: grading.canvas_json,
            submissionData: {
              image: grading.submissionData.image,
              student_id: grading.submissionData.student_id,
              createdAt: grading.submissionData.createdAt,
              assignmentData: {
                id: grading.submissionData.assignmentData.id,
                assignment_name: grading.submissionData.assignmentData.assignment_name,
                file_path: grading.submissionData.assignmentData.file_path
              },
              studentData: {
                student_name: grading.submissionData.studentData.student_name
              },
              classData: {
                class_name: grading.submissionData.classData.class_name,
              }
            }
          };
        }
      }

      // Chuyển đối tượng thành mảng
      const mergedResponse = Object.values(gradingMap);

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

//UPDATE
export const updateGradedAssignment = (gradeId, body, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      const imageFile = await db.Grade.findOne({
        where: { id: gradeId },
      });
      if (imageFile)
        cloudinary.api.delete_resources(imageFile[0].dataValues.filename);
      if (fileData) {
        body.image = fileData?.path;
        body.filename = fileData?.filename;
      }

      const response = await db.Grade.update(body, {
        where: { id: gradeId.gradeId },
      });

      resolve({
        err: response[0] > 0 ? 0 : 1,
        message:
          response[0] > 0
            ? `${response} grade updated`
            : "Can not update graded assignment!!!",
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
export const deleteAssignmentGraded = (gradingId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Grade.destroy({
        where: { id: gradingId.gradingId },
      });

      resolve({
        err: response > 0 ? 0 : 1,
        message: `${response} grade deleted`,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
