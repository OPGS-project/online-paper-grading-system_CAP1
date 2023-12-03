import * as services from "../services";
import { internalServerError, badRequest } from "../middlewares/handle_errors";
import joi from 'joi'
const cloudinary = require('cloudinary').v2;

//CREATE
export const saveGradedAssignments = async (req, res) => {
    try {
        // const {id} = req.user    
        // console.log(id) 
        const fileData = req.file
        const response = await services.saveGradedAssignments(req.body, fileData)
        return res.status(200).json(response)

    } catch (error) {
        // return internalServerError(res)
    }
}

//GET
export const getGradeById = async (req, res) => {
    try {
        const { idStudent } = req.params;
        console.log(idStudent);
        // const { studentId } = req.query;
        const response = await services.getGradeById(idStudent);
        return res.status(200).json(response)

    } catch (error) {
        console.log(error);
        // return internalServerError(res)
    }
}
// export const getGradeById = (submissionId, student_name) =>
//     new Promise(async (resolve, reject) => {
//         try {
//             const response = await db.Grade.findAll({
//                 attributes: ["score_value", "comments", "image"],
//                 where: { submission_id: submissionId },
//                 include: [
//                     {
//                         model: db.Submission,
//                         as: "submissionData",
//                         attributes: ["image", "student_id"],
//                         include: [
//                             {
//                                 model: db.Assignment,
//                                 as: "assignmentData",
//                                 attributes: ["assignment_name"],
//                             },
//                             {
//                                 model: db.Student,
//                                 as: "studentData",
//                                 attributes: ["student_name"],
//                             },
//                         ],
//                     },
//                 ],
//             });

//             resolve({
//                 err: response ? 0 : 1,
//                 message: response ? "Got" : "Can not found!!!",
//                 response,
//             });
//         } catch (e) {
//             console.log(e);
//             reject(e);
//         }
//     });