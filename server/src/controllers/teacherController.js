import { internalServerError, badRequest } from "../middlewares/handle_errors";
const teacherService = require("../services/teacherService");

export const getTeacher = async (req, res) => {
  const { currentUser } = req;
  try {
    if (!currentUser?.id) {
      return badRequest(error.details[0]?.message, res);
    }
    const response = await teacherService.getTeacher(currentUser?.id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};

export const getTeacherById = async (req, res) => {
  try {
    const { tid } = req.params;
    const response = await teacherService.getTeacherById(tid);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const fileData = req.file;
    const tid = req.params;
    const response = await teacherService.updateTeacher(
      tid,
      fileData,
      req.body
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};
