import * as authServices from "../services";
import { badRequest } from "../middlewares/handle_errors";
import joi from "joi";

export const loginStudent = async (req, res) => {
  try {
    const response = await authServices.loginStudent(req.body);
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
