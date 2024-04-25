import * as services from "../services";
import { internalServerError, badRequest } from "../middlewares/handle_errors";
import joi from 'joi'
import { response } from "express";
const cloudinary = require('cloudinary').v2;

//CREATE
export const saveGradedAssignments = async (req, res) => {
    try {
        const fileData = req.file
        const response = await services.saveGradedAssignments(req.body, fileData)
        return res.status(200).json(response)

    } catch (error) {
        // return internalServerError(res)
    }
}

//save short graded
export const saveGradedAssignmentShort = async (req, res) => {
  try {
    console.log("controller",req.body)
      const response = await services.saveGradedAssignmentShortService(req.body)
      return res.status(200).json(response)

  } catch (error) {
      console.log(error)
  }
}


//GET
export const getGradeById = async (req, res) => {
    try {
        const { idStudent } = req.params;

        console.log(idStudent);
        // const { studentId } = req.query;
        const response = await services.getGradeById(idStudent);
        return res.status(200).json(response);

    } catch (error) {
        console.log(error);
        // return internalServerError(res)
    }
}
// export const getGradedForStudent = async(req, res) =>{
//   try {
//     const { idStudent } = req.params;
//     console.log("for student",idStudent);
//     const response =await services.getGradedForStudentService(idStudent)
//     return res.status(200).json(response);
    
//   } catch (error) {
//     console.log(error)
//     // return res.status(500).json(response)
    
//   }
// }

export const getGrade = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { student_name } = req.params;

        const response = await services.getGrade(submissionId, student_name);
        return res.status(200).json(response)

    } catch (error) {
        console.log(error);
        // return internalServerError(res)
    }
}

//update
export const updateGradedAssignment = async (req, res) => {
    try {
      // console.log(req.body);
      const fileData = req.file;
      const gradeId = req.params;
      const { error } = joi.object().validate({ avatar: fileData?.path });
      if (error) {
        if (fileData) cloudinary.uploader.destroy(fileData.filename);
      }
      const response = await services.updateGradedAssignment(
        gradeId,
        req.body,
        fileData
      );
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      // return internalServerError(res);
    }
  };
  

//Delete 
export const deleteAssignmentGraded = async (req, res) => {
    try {
      const gradingId = req.params;
      const response = await services.deleteAssignmentGraded(gradingId);
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
    }
  };