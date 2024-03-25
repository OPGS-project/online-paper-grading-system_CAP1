import db from "../models";

//getAssignment of Student

export const getAssignmentOfStudent = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log(id);
      let response = await db.Student.findOne({
        where: { id },
        raw: false,
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
        include: [
          {
            model: db.Class,
            attributes: ["class_name"],
            through: {
              model: db.Student_Class,
            },
            include: [
              {
                model: db.Assignment,
                as: "assignmentData",
                attributes: ["assignment_name", "deadline", "id", "file_path"],
              },
            ],
          },
        ],
      });

      resolve({
        err: response ? 0 : 1,
        msg: response ? "OK" : "Student not found!",
        response,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });

export const getStudentCurrent = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      let response = await db.Student.findOne({
        where: { id },
        raw: true,
        attributes: {
          exclude: ["password", "refresh_token"],
        },
      });
      resolve({
        err: response ? 0 : 1,
        msg: response ? "OK" : "Student not found!",
        response,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
