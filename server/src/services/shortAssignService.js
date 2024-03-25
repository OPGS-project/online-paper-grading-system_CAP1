import db from "../models";

//chưa lấy được id_teacher
export const addShortAssignmentService = async (data, tid) => {
    try {
        // Ensure short_answers is a valid JSON object
        let ShortAnswers;
        if (typeof short_answers === 'string') {
            ShortAnswers = JSON.parse(short_answers);
        }
        const dataClass = await db.Class.findOne({
            where: { class_name: data.of_class },
        });
        // console.log(dataClass);
        // Create a new record in the Short_assignment table
        await db.Assignment.findOrCreate({
            where: { assignment_name: data?.assignment_name },
            defaults: {
                ...data,
                id_teacher: tid,
                of_class: dataClass.dataValues.id
            }
        });

        return { err: 0, mes: "Thêm bài tập ngắn thành công" };
    } catch (error) {
        throw error;
    }
};