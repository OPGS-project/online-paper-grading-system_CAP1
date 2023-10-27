import db from "../models";

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
