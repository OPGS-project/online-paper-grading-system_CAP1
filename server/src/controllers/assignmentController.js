import * as authServices from "../services";
const cloudinary = require("cloudinary").v2;
import joi from "joi";

export const getAssignment = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await authServices.getAssignment(id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};

export const getAssignmentById = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const response = await authServices.getAssignmentById(assignmentId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const createAssignment = async (req, res) => {
  try {
    const fileData = req.file;
    const { id } = req.user;

    const { error } = joi.object().validate({ file_path: fileData?.path });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
    const response = await authServices.createAssignment(
      req.body,
      fileData,
      id
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};
export const updateAssignment = async (req, res) => {
  try {
    // console.log(req.body);
    const fileData = req.file;
    const assignmentId = req.params;
    const { error } = joi.object().validate({ avatar: fileData?.path });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
    const response = await authServices.updateAssignment(
      assignmentId,
      req.body,
      fileData
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const assignmentId = req.params;
    const response = await authServices.deleteAssignment(assignmentId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
