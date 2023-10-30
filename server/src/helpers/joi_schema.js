import joi from "joi";

export const refreshToken = joi.string().required();
//auth
export const id = joi.string().required();
export const email = joi.string().pattern(new RegExp("gmail.com$")).required();
export const password = joi.string().min(6).required();
export const name = joi.string().min(3).max(30).required();
//assignment
export const assignment_name = joi.string().required();
export const start_date = joi.string().required();
export const deadline = joi.string().required();
export const of_class = joi.string().required();
export const content_text = joi.string().required();
export const grading_criteria_file = joi.number().required();
export const assignmentId = joi.string().required();
export const assignmentIds = joi.array().required();
//class
export const class_name = joi.string().required();
export const content = joi.string();
export const total_students = joi.number().required();
export const classID = joi.string().required();

//student
export const student_name = joi.string().required();
export const gender = joi.string().required();
export const address = joi.string().required();
