import { id } from "../helpers/joi_schema";
import db from "../models";
import { Op } from "sequelize";

//READ
export const getClasses = ({
  page,
  limit,
  order,
  name,

  ...query
}) =>
  new Promise(async (resolve, reject) => {
    try {
      const queries = { raw: false, nest: true };
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const fLimit = +limit || +process.env.LIMIT_NUMBER;
      queries.offset = offset * fLimit;
      queries.limit = fLimit;
      if (order) queries.order = [order];
      if (name) query.class_name = { [Op.substring]: name };
      const response = await db.Class.findAndCountAll({
        where: query,
        ...queries,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: db.Teacher,
            as: "teacherData",
            attributes: ["name"],
          },
        ],
      });

      resolve({
        err: response ? 0 : 1,
        message: response ? "Got" : "Can not found!!!",
        classData: response,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });

//CREATE
export const createNewClass = (body) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Class.findOrCreate({
        where: { class_name: body?.class_name },
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
// export const updateBook = ({bookID, ...body}, fileData) => new Promise( async(resolve, reject) =>{
//     try{
//         if (fileData) body.image = fileData?.path
//         const response= await db.Book.update(body,{
//             where : { id : bookID }
//         })
//         resolve({
//             err: response[0] > 0 ? 0 : 1,
//             mes: response[0] > 0 ? `${response[0]} book updated` : 'Cannot update book/ BookID not found',
//         })
//         if (fileData && !response[0] === 0) cloudinary.uploader.destroy(fileData.filename)
//     }catch (error){
//         reject(error)
//         if (fileData) cloudinary.uploader.destroy(fileData.filename)
//     }
// })

// //DELETE
// export const deleteBook = ( bookIDs, filename ) => new Promise( async(resolve, reject) =>{
//     try{
//         const response= await db.Book.destroy({
//             where : { id : bookIDs }
//         })
//         resolve({
//             err: response > 0 ? 0 : 1,
//             mes: `${response} book(s) deleted`
//         })
//         cloudinary.api.delete_resources( filename )
//     }catch (error){
//         reject(error)
//     }
// })
