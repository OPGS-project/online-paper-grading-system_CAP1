import * as authServices from "../services";
import { internalServerError, badRequest } from "../middlewares/handle_errors";
import { student_name, classID, gender, address } from "../helpers/joi_schema";
import joi from "joi";

export const getStudent = async (req, res) => {
  try {
    const response = await authServices.getStudent(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};

export const createStudent = async (req, res) => {
  try {
    const { error } = joi
      .object({ student_name, classID, gender, address })
      .validate(req.body);
    if (error) return badRequest(error.details[0].message, res);
    const response = await authServices.createStudent(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { studentId }= req.params;
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
