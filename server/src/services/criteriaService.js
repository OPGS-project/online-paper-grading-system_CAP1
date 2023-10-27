import { id } from "../helpers/joi_schema";
import db from "../models";
import { Op } from "sequelize";

//READ
export const getCriteria = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.Events.findAll({
        where: { id },
        raw: true,
        attributes: ["correct_answer", "max_score"],
      });

      resolve({
        err: response ? 0 : 1,
        mess: response ? "Got data" : "No data",
        respone: response,
      });
    } catch (error) {
      reject(error);
    }
  });
};
//CREATE
export const createCriteria = (body) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Events.findOrCreate({
        where: { correct_answer: body?.correct_answer },
        defaults: body,
      });
      resolve({
        err: response[1] ? 0 : 1,
        mes: response[1] ? "Created" : "Cannot create class",
      });
    } catch (error) {
      reject(error);
    }
  });

// //UPDATE
export const updateCriteria = (criteriaId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Events.update(body, {
        where: { id: criteriaId },
      });
      resolve({
        err: response[0] > 0 ? 0 : 1,
        mes:
          response[0] > 0
            ? `${response[0]} criteria updated`
            : "Cannot update criteria/ criteriaID not found",
      });
    } catch (error) {
      reject(error);
    }
  });

// //DELETE
export const deleteCriteria = (criteriaId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Events.destroy({
        where: { id: criteriaId },
      });
      resolve({
        err: response > 0 ? 0 : 1,
        mes: `${response} criteria deleted`,
      });
    } catch (error) {
      reject(error);
    }
  });
