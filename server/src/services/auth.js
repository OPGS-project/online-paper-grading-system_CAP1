import db from "../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../utils/email";
import { generateRandomString } from "../helpers/idRandom";

const hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const register = ({ name, email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Teacher.findOrCreate({
        where: { email },
        defaults: {
          id: generateRandomString(10),
          name,
          email,
          password: hashPassword(password),
        },
      });
      // console.log(response[1]);
      const token = response[1]
        ? jwt.sign(
            { id: response[0].id, email: response[0].email },
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
        err: token ? 0 : 3,
        msg: token ? "OK" : "User not found or fail to login !",
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

      const html = `Mật khẩu mới của bạn ở đây <h1> ${newPassword} </h1>`;
      const title = `123`;
      await sendMail({ email, html, title });
    } catch (e) {
      reject(e);
    }
  });
