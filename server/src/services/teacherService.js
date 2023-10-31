import db from "../models";
const cloudinary = require("cloudinary").v2;

export const getTeacher = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      let response = await db.Teacher.findOne({
        where: { id },
        raw: true,
        attributes: {
          exclude: ["password", "phone", "refresh_token"],
        },
        include: [
          {
            model: db.Role,
            as: "roleData",
            attributes: ["id", "code", "value"],
          },
        ],
      });
      resolve({
        err: response ? 0 : 4,
        msg: response ? "OK" : "Teacher not found!",
        response,
      });
    } catch (error) {
      reject(error);
    }
  });

//
export const getTeacherById = (tid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Teacher.findOne({
        where: { id: tid },
        attributes: {
          exclude: ["createdAt", "updatedAt", "refresh_token"],
        },
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

export const updateTeacher = ({ tid, ...body }, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      if (fileData) body.avatar = fileData?.path;
      let response = await db.Teacher.update({
        where: { id: tid },
      });
      resolve({
        err: response[0] > 0 ? 0 : 1,
        mes:
          response[0] > 0
            ? `${response[0]} user updated`
            : "Cannot update user/ userId not found",
      });
      if (fileData && !response[0] === 0)
        cloudinary.uploader.destroy(fileData.filename);
    } catch (e) {
      reject(e);
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
  });
