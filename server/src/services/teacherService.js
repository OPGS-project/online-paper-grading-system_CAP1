import db from "../models";
const cloudinary = require("cloudinary").v2;

export const getTeacher = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const dataId = await db.Assignment.findAll({
        where: { id_teacher: id },
      });

      let response = await db.Teacher.findOne({
        where: { id },
        raw: false,

        attributes: {
          exclude: ["createdAt", "updatedAt", "filename"],
        },
        include: [
          {
            model: db.Class,
            as: "classData",
            attributes: ["class_name"],
          },
          {
            model: db.Assignment,
            as: "assignmentData",
            include: [
              {
                model: db.Class,
                as: "classData",
                attributes: ["class_name"],
              },
            ],
          },
        ],
      });
      resolve({
        err: response ? 0 : 4,
        msg: response ? "OK" : "Teacher not found!",
        response,
        dataId,
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
