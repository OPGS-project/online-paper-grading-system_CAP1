import db from "../models";

export const addShortAssignmentService = async (data, tid) => {
    try {
        const { assignment_name, question_name } = data;
        console.log(data);
        // Ensure question_name is a valid JSON object
        let ShortAnswers = question_name;
        if (typeof question_name === 'string') {
            ShortAnswers = JSON.parse(question_name);
        }

        // Create a new record in the Short_assignment table
        await db.Short_assignment.findOrCreate({
            assignment_name: assignment_name,
            id_teacher: tid,
            question_name: ShortAnswers,
            // Add other fields as necessary
        });

        return { err: 0, mes: "Thêm bài tập ngắn thành công" };
    } catch (error) {
        throw error;
    }
};
