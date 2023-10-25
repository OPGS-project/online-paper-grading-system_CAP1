import * as authServices from "../services";
import { internalServerError, badRequest } from "../middlewares/handle_errors";
import { name, email, password, refreshToken } from "../helpers/joi_schema";
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
    // console.log(error);
    return internalServerError(res);
  }
};

export const loginSuccess = async (req, res) => {
  const { id, refresh_token } = req?.body;
  try {
    if (!id || !refresh_token) {
      return badRequest(error.details[0]?.message, res);
    }
    const response = await authServices.loginSuccess(id, refresh_token);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};

//refresh_token
export const refreshTokenController = async (req, res) => {
  try {
    const { error } = joi.object({ refreshToken }).validate(req.body);
    if (error) return badRequest(error.details[0]?.message, res);
    const response = await authServices.refreshToken(req.body.refreshToken);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

//resetPassword
export const resetPassword = async (req, res) => {
  try {
    const { error } = joi.object({ email }).validate(req.body);
    if (error) return badRequest(error.details[0]?.message, res);
    const response = await authServices.resetPassword(req.body.email);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
//
export const changePassword = async (req, res) => {
  try {
    const { id } = req.user;

    const response = await services.changePassword(req.body, id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
