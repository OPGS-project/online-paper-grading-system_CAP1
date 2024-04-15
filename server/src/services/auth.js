import db from "../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../utils/email";
import { generateRandomString } from "../helpers/idRandom";
const { v4: uuidv4 } = require("uuid");

const hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const register = ({ name, email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Teacher.findOrCreate({
        where: { email },
        defaults: {
          id: generateRandomString(5),
          name,
          email,
          password: hashPassword(password),
        },
      });
      // console.log(response[1]);
      const token = response[1]
        ? jwt.sign(
            {
              id: response[0].id,
              email: response[0].email,
              role: response[0].role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" } // time hết hạn của token
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
        await db.Teacher.update(
          {
            refresh_token: refreshToken,
          },
          {
            where: { id: response[0].id },
          }
        );
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });

export const login = ({ email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Teacher.findOne({
        where: { email },
        raw: true,
      });

      const isChecked =
        response && bcrypt.compareSync(password, response.password);
      const token = isChecked
        ? jwt.sign(
            { id: response.id, email: response.email, role: response.role },
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
          : "Email không tồn tại",
        token: isChecked ? token : token,
        refresh_token: refreshToken,
      });

      if (refreshToken) {
        await db.Teacher.update(
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

//login w google
export const loginSuccess = (id, refresh_token) =>
  new Promise(async (resolve, reject) => {
    try {
      const newToken = uuidv4();
      let response = await db.Teacher.findOne({
        where: { id, refresh_token },
        raw: true,
      });
      const token =
        response &&
        jwt.sign(
          { id: response.id, email: response.email, role: response.role },
          process.env.JWT_SECRET,
          { expiresIn: "5d" }
        );

      resolve({
        err: token ? 0 : 3,
        msg: token ? "OK" : "User not found or fail to login !",
        token,
      });
      if (response) {
        await db.Teacher.update(
          {
            refresh_token: newToken,
          },
          {
            where: { id },
          }
        );
      }
    } catch (error) {
      console.log(error);
      reject({
        err: 2,
        msg: "Fail at auth server" + error,
      });
    }
  });
//  refreshToken
export const refreshToken = (refresh_token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Teacher.findOne({
        where: { refresh_token: refresh_token },
      });
      console.log(response);
      if (response) {
        jwt.verify(
          refresh_token,
          process.env.JWT_SECRET_REFRESH_TOKEN,
          (err) => {
            if (err)
              resolve({
                err: 1,
                mess: "Refresh token expired. Require login again!!",
              });
            else {
              const token = jwt.sign(
                {
                  id: response.id,
                  email: response.email,
                  roleCode: response.role_code,
                },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
              );
              resolve({
                err: token ? 0 : 1,
                mess: token ? "Ok" : "Fail to generate new access token",
                token,
                refresh_token: refresh_token,
              });
            }
          }
        );
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });

//reset-password
export const resetPassword = (email) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Teacher.findOne({
        where: { email: email },
      });
      let newPassword = (Math.random() + 1).toString(36).substring(4);
      if (response === null) {
        resolve({
          success: false,
          mess: "Email is wrong",
        });
      } else {
        const response = await db.Teacher.update(
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
export const changePassword = (body, userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Teacher.findOne({
        where: { id: userId },
      });
      const isChecked =
        response && bcrypt.compareSync(body.password, response.password);
      const response1 = isChecked
        ? body.newPassword == body.password
          ? "Must not match the old password"
          : await db.Teacher.update(
              { password: hashPassword(body.newPassword) },
              { where: { id: userId } }
            )
        : "Password is wrong";
      resolve({
        err: response1[0] > 0 ? 0 : 1,
        mess: response1[0] > 0 ? "Changed password successfully" : response1,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
