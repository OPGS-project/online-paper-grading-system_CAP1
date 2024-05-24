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


export const editShortAssignmentService = async (body, assignmentId) => {
    return new Promise(async (resolve, reject) => {
        // console.log("Service: Body received:", body);
        // console.log("Service: Assignment ID:", assignmentId);
        // console.log("serrvice:", body.type_assignment)
        try {
            if (!assignmentId) {
                resolve({
                    errCode: 2,
                    errMessage: "missing required parameter"
                });
                return;
            }
            const response = await db.Assignment.update(
                {
                    assignment_name: body.assignment_name,
                    description: body.description,
                    question_name: body.question_name,
                    of_class: body.of_class,
                    start_date: body.start_date,
                    deadline: body.deadline,
                    // type_assignment: 1
                },
                {
                    where: { id: assignmentId }
                }
            );
           if (response) {
                resolve({
                    errCode: 0,
                    message: "Sửa bài thành công",
                    response:response
                });
            } else {
                resolve({
                    errCode: 1,
                    message: "Không tìm thấy id assignment"
                });
            }
        } catch (error) {
            console.error("Error during assignment update:", error);
            reject(error);
        }
    });
};



