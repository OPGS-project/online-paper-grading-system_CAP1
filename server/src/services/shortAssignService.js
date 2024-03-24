import db from "../models";




//chưa lấy được id_teacher
export const addShortAssignmentService = async (data, tid) => {
    try {
        const { assignment_name, short_answers } = data;

        // Ensure short_answers is a valid JSON object
        let ShortAnswers = short_answers;
        if (typeof short_answers === 'string') {
            ShortAnswers = JSON.parse(short_answers);
        }

        // Create a new record in the Short_assignment table
        await db.Short_Assignment.create({
            assignment_name: assignment_name,
            id_teacher: tid,
            question_name: ShortAnswers
            // Add other fields as necessary
        });

        return { err: 0, mes: "Thêm bài tập ngắn thành công" };
    } catch (error) {
        throw error;
    }
};