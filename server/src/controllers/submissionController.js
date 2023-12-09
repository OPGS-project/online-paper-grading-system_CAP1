import * as services from "../services";
import { internalServerError, badRequest } from "../middlewares/handle_errors";
import { bookID,title, price, available, category_code, image, bookIDs, filename } from "../helpers/joi_schema";
import joi from 'joi'
const cloudinary = require('cloudinary').v2;

export const getSubmissionById= async (req, res) =>{
    try{ 
        
        const { assignment_id } = req.params;
        const response = await services.getSubmissionById(assignment_id)
        return res.status(200).json(response)

    }catch (error){
        return internalServerError(res)
    }
}

export const getSubmission= async (req, res) =>{
    try{      
        const response = await services.getSubmission(req.query)
        return res.status(200).json(response)

    }catch (error){
        return internalServerError(res)
    }
}


//CREATE
// export const uploadSubmission= async (req, res) =>{
//     try{ 
//         const {id} = req.user    
//         // console.log(id) 
       
//         const fileData = req.files
//         console.log(fileData)
//         const {error} = joi.object().validate(fileData.filename)
//         if(error) {
//             cloudinary.uploader.destroy(fileData.filename);
//         }
//         const response = await services.uploadSubmission(req.body, fileData, id)
//         return res.status(200).json(response)

//     }catch (error){
//         console.log(error);
//         // return internalServerError(res)

//     }
// }

export const uploadSubmission = async (req, res) => {
  try {
    const { id } = req.user;
    const fileDataArray = req.files;
    const class_id = req.body.class_id;
    // console.log(class_id);
    // Loop through each file
    const responses = [];
    for (const fileData of fileDataArray) {
        // console.log(fileData)
    //   const { filename, image } = fileData;
      const { error } = joi.string().validate(fileData.filename);
      if (error) {
        // If there's an error with the filename, destroy the uploaded file
        cloudinary.uploader.destroy(fileData.filename);    
      }
      const response = await services.uploadSubmission(req.body, fileData, id,class_id);
      responses.push(response);
    }
    return res.status(200).json(responses);
  } catch (error) {
    console.log(error);
    // Handle errors appropriately
    // return res.status(500).json({ error: 'Internal Server Error' });
  }
};

  

