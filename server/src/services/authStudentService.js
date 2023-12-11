import db from "../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// const hashPassword = (password) =>
//   bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const loginStudent = ({ username, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Student.findOne({
        where: { username },
        raw: true,
      });

      const isChecked = response && password === response.password;
      const token = isChecked
        ? jwt.sign(
            { id: response.id, email: response.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
          )
        : null;
      //Refresh_token
      const refreshToken = isChecked
        ? jwt.sign(
            {
              id: response.id,
            },
            process.env.JWT_SECRET_REFRESH_TOKEN,
            { expiresIn: "10d" }
          )
        : null;
      resolve({
        err: token ? 0 : 1, //1 là true
        mes: token
          ? "Login thành công"
          : response
          ? "Password sai"
          : "username không tồn tại",
        token: isChecked ? token : token,
        refresh_token: refreshToken,
      });

      if (refreshToken) {
        await db.Student.update(
          {
            refresh_token: refreshToken,
          },
          {
            where: { id: response.id },
          }
        );
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });

//change-password
export const changePasswordStudent = (body, userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Student.findOne({
        where: { id: userId },
      });
      const isChecked = response && body.password === response.password;
      const response1 = isChecked
        ? body.newPassword == body.password
          ? "Must not match the old password"
          : await db.Student.update(
              { password: body.newPassword },
              { where: { id: userId } }
            )
        : "Password is wrong";
      resolve({
        err: response1[0] > 0 ? true : false,
        mes: response1[0] > 0 ? "Changed password successfully" : response1,
      });
    } catch (e) {
      reject(e);
    }
  });
