import db from "../models";
const cloudinary = require("cloudinary").v2;

export const getTeacher = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      let response = await db.Teacher.findOne({
        where: { id },
        raw: true,
        attributes: {
          exclude: ["password", "refresh_token"],
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

export const updateTeacher = (tid, body, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      const fileImage = await db.Teacher.findOne({
        where: { id: tid },
      });
      cloudinary.api.delete_resources(fileImage.dataValues.fileName);
      if (fileData) {
        body.avatar = fileData?.path;
        body.fileName = fileData?.filename;
      }
      console.log(fileData);
      const response = await db.Teacher.update(body, {
        where: { id: tid },
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
