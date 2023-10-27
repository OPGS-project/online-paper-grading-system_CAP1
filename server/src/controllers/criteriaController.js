import * as services from "../services";
import { internalServerError, badRequest } from "../middlewares/handle_errors";

import {} from "../helpers/joi_schema";
import joi from "joi";

export const getCriteria = async (req, res) => {
  try {
    const response = await services.getCriteria(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);

    // return internalServerError(res);
  }
};

//CREATE
export const createCriteria = async (req, res) => {
  try {
    const response = await services.createCriteria(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};
// //UPDATE
export const updateCriteria = async (req, res) => {
  try {
    const { criteriaId } = req.params;
    const response = await services.updateCriteria(criteriaId, req.body);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

// //DELETE
export const deleteCriteria = async (req, res) => {
  try {
    const { criteriaId } = req.params;
    const response = await services.deleteCriteria(criteriaId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};
