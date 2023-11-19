import db from "../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../utils/email";
import { generateRandomString } from "../helpers/idRandom";

const hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const registerStudent = ({ name, email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Student.findOrCreate({
        where: { email },
        defaults: {
          id: generateRandomString(10),
          email,
          student_name: name,
          password: hashPassword(password),
        },
      });

      const token = response[1]
        ? jwt.sign(
            {
              id: response[0].id,
              email: response[0].email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "2d" } // time hết hạn của token
          )
        : null;
      //Refresh_token
      const refreshToken = response[1]
        ? jwt.sign(
            {
              id: response[0].id,
            },
            process.env.JWT_SECRET_REFRESH_TOKEN,
            { expiresIn: "10d" }
          )
        : null;
      resolve({
        err: response[1] ? 0 : 1,
        mes: response[1] ? "Register thành công" : "Email đã tồn tại",
        token,
        refresh_token: refreshToken,
      });
      if (refreshToken) {
        await db.Student.update(
          {
            refresh_token: refreshToken,
          },
          {
            where: { id: response[0].id },
          }
        );
      }
      // console.log(student_name);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });

export const loginStudent = ({ email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Student.findOne({
        where: { email },
        raw: true,
      });

      const isChecked =
        response && bcrypt.compareSync(password, response.password);
      const token = isChecked
        ? jwt.sign(
            { id: response.id, email: response.email },
            process.env.JWT_SECRET,
            { expiresIn: "2d" } // time hết hạn của token
          ) // mã hóa
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
          : "Email không tồn tại",
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

//reset-password
export const resetPasswordStudent = (email) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Student.findOne({
        where: { email: email },
      });
      let newPassword = (Math.random() + 1).toString(36).substring(4);
      if (response === null) {
        resolve({
          success: false,
          mess: "Email is wrong",
        });
      } else {
        const response = await db.Student.update(
          { password: hashPassword(newPassword) },
          {
            where: { email },
          }
        );
        resolve({
          success: true,
          mess: "Please check Email!!",
          newPassword: newPassword,
        });
      }

      const html = ` Xin chào ${response.name}, <br> Đã có yêu cầu đặt lại mật khẩu của bạn! <br> Mật khẩu mới của bạn là : <strong>${newPassword} </strong>`;
      const title = `Đặt Lại Mật Khẩu`;
      await sendMail({ email, html, title });
    } catch (e) {
      reject(e);
    }
  });
//change-password
export const changePasswordStudent = (body, userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Student.findOne({
        where: { id: userId },
      });
      const isChecked =
        response && bcrypt.compareSync(body.password, response.password);
      const response1 = isChecked
        ? body.newPassword == body.password
          ? "Must not match the old password"
          : await db.Student.update(
              { password: hashPassword(body.newPassword) },
              { where: { id: userId } }
            )
        : "Password is wrong";
      resolve({
        success: response1[0] > 0 ? true : false,
        mess: response1[0] > 0 ? "Changed password successfully" : response1,
      });
    } catch (e) {
      reject(e);
    }
  });
