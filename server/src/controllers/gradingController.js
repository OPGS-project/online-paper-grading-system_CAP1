import * as services from "../services";
import { internalServerError, badRequest } from "../middlewares/handle_errors";
import joi from 'joi'
const cloudinary = require('cloudinary').v2;

//CREATE
export const saveGradedAssignments = async (req, res) =>{
    try{ 
        // const {id} = req.user    
        // console.log(id) 
        const fileData = req.file
        const response = await services.saveGradedAssignments(req.body, fileData)
        return res.status(200).json(response)

    }catch (error){
        // return internalServerError(res)
    }
}

//GET
export const getGradeById= async (req, res) =>{
    try{ 
        const { idStudent } = req.params;
        console.log(idStudent);
        // const { studentId } = req.query;
        const response = await services.getGradeById(idStudent);
        return res.status(200).json(response)

    }catch (error){
        console.log(error);
        // return internalServerError(res)
    }
}