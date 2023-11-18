import * as authServices from "../services";
import { internalServerError, badRequest } from "../middlewares/handle_errors";
import { name, email, password } from "../helpers/joi_schema";
import joi from "joi";

export const registerStudent = async (req, res) => {
  try {
    const { error } = joi.object({ name, email, password }).validate(req.body);
    if (error) {
      return badRequest(error.details[0]?.message, res);
    }
    const response = await authServices.registerStudent(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};

export const loginStudent = async (req, res) => {
  try {
    const { error } = joi.object({ email, password }).validate(req.body);
    if (error) {
      return badRequest(error.details[0]?.message, res);
    }
    const response = await authServices.loginStudent(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};

//resetPassword
export const resetPasswordStudent = async (req, res) => {
  try {
    // const { error } = joi.object({ email }).validate(req.body);
    // if (error) return badRequest(error.details[0]?.message, res);
    const response = await authServices.resetPasswordStudent(req.body.email);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};
//
export const changePasswordStudent = async (req, res) => {
  try {
    const { id } = req.user;

    const response = await services.changePasswordStudent(req.body, id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
