import * as authServices from "../services";
import { internalServerError, badRequest } from "../middlewares/handle_errors";
import { name, email, password } from "../helpers/joi_schema";
import joi from "joi";

export const register = async (req, res) => {
  try {
    const { error } = joi.object({ name, email, password }).validate(req.body);
    if (error) {
      return badRequest(error.details[0]?.message, res);
    }
    const response = await authServices.register(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const login = async (req, res) => {
  try {
    const { error } = joi.object({ email, password }).validate(req.body);
    if (error) {
      return badRequest(error.details[0]?.message, res);
    }
    const response = await authServices.login(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const loginSuccess = async (req, res) => {
  const { id } = req?.body;
  try {
    if (!id) {
      return badRequest(error.details[0]?.message, res);
    }
    const response = await authServices.loginSuccess(id);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
