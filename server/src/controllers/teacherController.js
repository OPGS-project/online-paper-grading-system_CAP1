import { badRequest } from "../middlewares/handle_errors";
const teacherService = require("../services/teacherService");
const cloudinary = require("cloudinary").v2;
import joi from "joi";

export const getTeacher = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await teacherService.getTeacher(id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const fileData = req.file;
    const { id } = req.user;

    const { error } = joi.object().validate({ avatar: fileData?.path });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }

    const response = await teacherService.updateTeacher(id, req.body, fileData);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};
