import { id } from "../helpers/joi_schema";
import db from "../models";
import { Op } from "sequelize";
// import { v4 as generateId } from "uuid";
const cloudinary = require("cloudinary").v2;

export const getStudent = (cid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.Class.findOne({
        where: { id: cid },
        raw: false,
        attributes: ["id", "class_name"],
        include: [
          {
            model: db.Student,
            attributes: ["id", "student_name", "gender", "address", "birthday"],
            through: {
              model: db.Student_Class,
            },
          },
        ],
      });
      resolve({
        err: response ? 0 : 1,
        mess: response ? "Get data success" : "Get data failure",
        response: response,
      });
    } catch (error) {
      reject(error);
    }
  });
};

//

//getAssignment of Student

// export const getAssignmentOfStudent = (id) =>
//   new Promise(async (resolve, reject) => {
//     try {
//       let response = await db.Student.findOne({
//         where: { id },
//         raw: false,
//         attributes: {
//           exclude: ["createdAt", "updatedAt", "password"],
//         },
//         include: [
//           {
//             model: db.Class,
//             attributes: ["class_name"],
//             through: {
//               model: db.Student_Class,
//             },
//             // include: [
//             //   {
//             //     model: db.Assignment,
//             //     as: "assignmentData",
//             //     attributes: ["assignment_name", "deadline", "id", "file_path"],
//             //   },
//             // ],
//           },
//         ],
//       });

//       resolve({
//         err: response ? 0 : 1,
//         msg: response ? "OK" : "Student not found!",
//         response,
//       });
//     } catch (error) {
//       console.log(error);
//       reject(error);
//     }
//   });

//CREATE
export const createStudent = (body) =>
  new Promise(async (resolve, reject) => {
    try {
      // const dataClass = await db.Class.findOne({
      //   where: { clas },
      // });
      const response = await db.Student.create({
        student_name: body.student_name,
        gender: body.gender,
        address: body.address,
        class_id: body.classID,
        birthday: body.birthday,
        username: body.username,
        password: body.password,
      });
      // console.log(response);
      const dataStudent = await db.Student_Class.create({
        class_id: response.class_id,
        student_id: response.id,
      });
      resolve({
        err: response ? 0 : 1,
        mes: response ? "Created student" : "Can not create Student!!!",
        res: response,
        dataStudent,
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

//update-profile-student
export const updateStudentProfile = (sid, body, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      const fileImage = await db.Student.findOne({
        where: { id: sid },
      });
      cloudinary.api.delete_resources(fileImage.dataValues.fileName);
      if (fileData) {
        body.avatar = fileData?.path;
        body.fileName = fileData?.filename;
      }
      // console.log(fileData);
      const response = await db.Student.update(body, {
        where: { id: sid },
      });
      // console.log(response);

      resolve({
        err: response[0] > 0 ? 0 : 1,
        mes: response[0] > 0 ? "Update successfully" : "not",
      });
      if (fileData && !response[0] === 0)
        cloudinary.uploader.destroy(fileData.filename);
    } catch (e) {
      reject(e);
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
  });
