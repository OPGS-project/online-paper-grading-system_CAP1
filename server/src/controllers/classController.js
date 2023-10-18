import * as services from "../services";
import { internalServerError, badRequest } from "../middlewares/handle_errors";

import { class_name, total_students } from "../helpers/joi_schema";
import joi from "joi";

export const getClasses = async (req, res) => {
  try {
    const response = await services.getClasses(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);

    // return internalServerError(res);
  }
  console.log(req.query);
};

//CREATE
export const createNewClass = async (req, res) => {
  try {
    const { error } = joi
      .object({ class_name, total_students })
      .validate(req.body);
    if (error) {
      return badRequest(error.details[0].message, res);
    }
    const response = await services.createNewClass(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

// //UPDATE
// export const updateBook= async (req, res) =>{
//     try{
//         const fileData = req.file
//         const {error} = joi.object({ bookID }).validate( { bookID: req.body.bookID} )
//         if (error) {
//             if (fileData) cloudinary.uploader.destroy(fileData.filename)
//             return badRequest(error.details[0].message, res)
//         }
//         const response = await services.updateBook(req.body, fileData)
//         return res.status(200).json(response)

//     }catch (error){
//         return internalServerError(res)
//     }
// }

// //DELETE
// export const deleteBook= async (req, res) =>{
//     try{
//         const {error} = joi.object({ bookIDs, filename }).validate( req.query )
//         if (error) {
//             return badRequest(error.details[0].message, res)
//         }
//         const response = await services.deleteBook(req.query.bookIDs, req.query.filename)
//         return res.status(200).json(response)

//     }catch (error){
//         return internalServerError(res)
//     }
// }
