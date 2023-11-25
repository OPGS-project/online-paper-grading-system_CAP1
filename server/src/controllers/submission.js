import * as services from "../services";
import { internalServerError, badRequest } from "../middlewares/handle_errors";
import { bookID,title, price, available, category_code, image, bookIDs, filename } from "../helpers/joi_schema";
import joi from 'joi'
const cloudinary = require('cloudinary').v2;

export const get_submission_ById= async (req, res) =>{
    try{ 
        const { studentId } = req.params;
        const response = await services.get_submission_ById(studentId);
        return res.status(200).json(response)

    }catch (error){
        console.log(error);
        // return internalServerError(res)
    }
}

export const getStudentSubmittedById= async (req, res) =>{
    try{ 
        const { assignmentId } = req.params;
        // const { assignmentId } = req.query;
        const response = await services.getStudentSubmittedById(assignmentId);
        // const response = await services.get_submission_ById(studentId, assignmentId)

        return res.status(200).json(response)

    }catch (error){
        console.log(error);
        // return internalServerError(res)
    }
}








