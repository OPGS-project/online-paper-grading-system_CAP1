import * as authServices from "../services";
import { internalServerError, badRequest } from "../middlewares/handle_errors";
import { student_name, classID, gender, address } from "../helpers/joi_schema";
import joi from "joi";
const cloudinary = require("cloudinary").v2;

export const getStudent = async (req, res) => {
  try {
    const response = await authServices.getStudent(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};
export const getStudentCurrent = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await authServices.getStudentCurrent(id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};
//
export const getAssignmentOfStudent = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await authServices.getAssignmentOfStudent(id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};
//
export const createStudent = async (req, res) => {
  try {
    const { student_name, classID, gender, address } = req.body;
    const { error } = joi
      .object({ student_name, classID, gender, address })
      .validate({ student_name, classID, gender, address });

    if (error) return badRequest(error.details[0].message, res);
    const response = await authServices.createStudent(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { studentId, classID } = req.params;
    const response = await authServices.updateStudent(studentId, req.body);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
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
