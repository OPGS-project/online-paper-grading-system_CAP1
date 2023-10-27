import * as services from "../services";
import { internalServerError, badRequest } from "../middlewares/handle_errors";

import {
  class_name,
  total_students,
  classID,
  content,
} from "../helpers/joi_schema";
import joi from "joi";

export const getClasses = async (req, res) => {
  try {
    const response = await services.getClasses(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);

    // return internalServerError(res);
  }
  console.log(req.query);
};
export const getStudentByClassId = async (req, res) => {
  try {
    const { classID } = req.params;
    const response = await services.getStudentByClassId(classID);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
//CREATE
export const createNewClass = async (req, res) => {
  try {
    const { error } = joi
      .object({ class_name, total_students, content })
      .validate(req.body);
    if (error) {
      return badRequest(error.details[0].message, res);
    }
    const response = await services.createNewClass(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};
//UPDATE
export const updateClass = async (req, res) => {
  try {
    const { classID } = req.params;
    const response = await services.updateClass(classID, req.body);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

//DELETE
export const deleteClass = async (req, res) => {
  try {
    const { classID } = req.params;
    const response = await services.deleteClass(classID);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};
