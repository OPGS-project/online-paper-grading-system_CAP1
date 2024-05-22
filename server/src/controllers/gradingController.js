import * as services from "../services";
import { internalServerError, badRequest } from "../middlewares/handle_errors";
import joi from 'joi'
import { response } from "express";
import { spawn } from 'child_process';
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
// Get grade essay from info's student
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

// Get grade short from info's student
export const getGradeShort = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { student_name } = req.params;

    const response = await services.getGradeShort(submissionId, student_name);
    return res.status(200).json(response)

  } catch (error) {
    console.log(error);
    // return internalServerError(res)
  }
}

//update grading essay assignment
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

//update grading short assignment
export const updateGradedShortAssignment = async (req, res) => {
  try {
    const gradeId = req.params;
    
    const response = await services.updateGradedShortAssignment(
      gradeId,
      req.body
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
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

/**
 * Calculates the similarity between two texts using a Python script.
 * @param {string} text1 The first text.
 * @param {string} text2 The second text.
 * @returns {Promise<number>} A Promise that resolves to the similarity value.
 */

export async function calculateSimilarity(req, res) {
  const { answerStudent } = req.body;
  const grades = [];
  for (const answer of answerStudent) {
    grades.push(answer.grade);
  }

  const similarityPercentages = [];

  // Function to calculate similarity for a single question
  const calculateQuestionSimilarity = async (teacherAnswer, studentAnswer) => {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', [
        'D:\\Cap1\\online-paper-grading-system_CAP1\\server\\src\\services\\calculateSimilarityService.py',
        `"${teacherAnswer}"`,
        `"${studentAnswer}"`
      ]);
      
      let similarityPercentage = '';

      pythonProcess.stdout.on('data', (data) => {
        similarityPercentage += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python script error: ${data}`);
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(`Python script exited with code ${code}`);
        } else {
          similarityPercentage = parseFloat(similarityPercentage.trim());
          if (isNaN(similarityPercentage)) {
            reject('Invalid similarity percentage returned by Python script');
          } else {
            resolve(similarityPercentage);
          }
        }
      });

      pythonProcess.on('error', (err) => {
        console.error('Error executing Python script:', err);
        reject(`Error executing Python script: ${err}`);
      });
    });
  };

  try {
    // Loop through each question and calculate similarity
    for (const { teacherAnswer, studentAnswer } of answerStudent) {
      const similarityPercentage = await calculateQuestionSimilarity(teacherAnswer, studentAnswer);
      similarityPercentages.push(similarityPercentage);
    }

    // console.log('Similarity percentages:', similarityPercentages);
    return res.json({ similarityPercentages, grades });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
}
