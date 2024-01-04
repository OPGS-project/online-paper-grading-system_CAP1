import * as authServices from "../services";
import joi from "joi";
import fs from "fs";
import csvParser from "csv-parser";
import { badRequest, internalServerError } from "../middlewares/handle_errors";
import models from "../models";
const cloudinary = require("cloudinary").v2;

export const getStudent = async (req, res) => {
  try {
    const { cid } = req.params;
    // console.log(req.params);
    const response = await authServices.getStudent(cid);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);

    // return internalServerError(res);
  }
};

//
// export const getAssignmentOfStudent = async (req, res) => {
//   try {
//     const { id } = req.user;
//     console.log(req.user);
//     const response = await authServices.getAssignmentOfStudent(id);
//     return res.status(200).json(response);
//   } catch (error) {
//     console.log(error);
//     // return internalServerError(res);
//   }
// };

//
export const createStudent = async (req, res) => {
  try {
    const response = await authServices.createStudent(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { studentId, classID } = req.params;
    const response = await authServices.updateStudent(studentId, req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);

    // return internalServerError(res);
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const response = await authServices.deleteStudent(studentId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const uploadCSV = async (req, res) => {
  const csvFilePath = `${__dirname}/../uploads/${req.file.filename}`;
  console.log("CSV File Path:", csvFilePath);
  const { classId } = req.params;
  console.log(classId);
  const results = [];

  const processCSV = () => {
    return new Promise((resolve, reject) => {
      const stream = fs
        .createReadStream(csvFilePath)
        .pipe(csvParser())
        .on("data", async (data) => {
          try {
            const object = {};
            console.log(data);
            for (const [key, value] of Object.entries(data)) {
              if (key === "Giới tính") {
                object.gender = value;
              } else if (key === "Ngày sinh") {
                object.birthday = value;
              } else if (key === "Quê quán") {
                object.address = value;
              } else if (key === "username" || key === "Tài khoản") {
                object.username = value;
              } else if (key === "password" || key === "Mật khẩu") {
                object.password = value;
              } else if (key === "Số điện thoại" || key === "sđt") {
                object.phone = value;
              } else {
                object["student_name"] = value;
              }
            }
            object.class_id = classId;
            // console.log(object);

            // Parse the date string into a JavaScript Date object
            const parsedBirthday = new Date(object.birthday);
            // Check if the parsed date is valid
            if (isNaN(parsedBirthday.getTime())) {
              throw new Error("Invalid date format in CSV data");
            }

            // Create a new instance of the Student model
            const newStudent = await models.Student.create(object);
            const studentId = newStudent.id;
            const response1 = await models.Student_Class.create({
              student_id: studentId,
              class_id: object.class_id,
            });
            // console.log(response1);
            resolve({
              err: response1 ? 0 : 1,
              mes: response1 ? "Created student" : "Can not create Student!!!",
              res: response1,
            });
            // console.log(object.class_id);
            results.push(newStudent);
          } catch (err) {
            console.error(
              "Error inserting data into MySQL database:",
              err.message
            );
            reject(err);
          }
        })
        .on("end", () => {
          fs.unlinkSync(csvFilePath);
          resolve();
        })
        .on("error", (error) => {
          console.error(
            "Error during CSV parsing or database insertion:",
            error.message
          );
          reject(error);
        });
    });
  };

  try {
    await processCSV();
    res.json({
      success: true,
      message: "CSV file uploaded and data inserted into the database.",
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error during CSV parsing or database insertion.",
      error: error.message,
    });
  }
};

//
export const updateStudentProfile = async (req, res) => {
  try {
    const fileData = req.file;
    const { id } = req.user;

    const { error } = joi.object().validate({ avatar: fileData?.path });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }

    const response = await authServices.updateStudentProfile(
      id,
      req.body,
      fileData
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};
