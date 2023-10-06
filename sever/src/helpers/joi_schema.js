import joi from "joi";

export const email = joi.string().pattern(new RegExp("gmail.com$")).required();
export const password = joi.string().min(6).required();
export const name = joi.string().min(3).max(30).required();
// export const description = joi.string().required();
// export const price = joi.number().required();
// export const available = joi.number().required();
// export const category_code = joi.string().uppercase().alphanum().required();
// export const image = joi.string().required();
// export const bookId = joi.string().required();
// export const bookIds = joi.array().required();
// export const filename = joi.array().required();
// export const refreshToken = joi.string().required();
