import db from "../models";
const cloudinary = require("cloudinary").v2;

export const addShortAssignmentService = async (body, fileData, tid) => {
    try {
        if (fileData) {
            body.file_path = fileData?.path;
            body.filename = fileData?.filename;
        }
        const dataClass = await db.Class.findOne({
            where: { class_name: body.of_class },
        });

        const created = await db.Assignment.findOrCreate({
            where: { assignment_name: body?.assignment_name },
            defaults: {
                ...body,
                id_teacher: tid,
                of_class: dataClass.dataValues.id
            }
        });
        
        if (fileData && created) {
            // Destroy the uploaded file if assignment is newly created
            await cloudinary.uploader.destroy(fileData.filename);
        }

        if (created) {
            return { err: 0, mes: "Thêm bài tập ngắn thành công" };
        } else {
            return { err: 1, mes: "Can not create file pdf Assignment!!!" };
        }
    } catch (error) {
        throw error;
    }
};
