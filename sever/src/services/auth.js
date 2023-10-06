import db from "../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const register = ({ name, email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Teacher.findOrCreate({
        where: { email },
        defaults: {
          name,
          email,
          password: hashPassword(password),
        },
      });
      console.log(response[1]);
      const token = response[1]
        ? jwt.sign(
            { id: response[0].id, email: response[0].email },
            process.env.JWT_SECRET,
            { expiresIn: "5d" } // time hết hạn của token
          ) // mã hóa
        : null;
      resolve({
        err: response[1] ? 0 : 1, //0 là true
        mes: response[1] ? "Register thành công" : "Email đã tồn tại",
        token,
      });
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
            { expiresIn: "5d" } // time hết hạn của token
          ) // mã hóa
        : null;
      resolve({
        err: token ? 0 : 1, //1 là true
        mes: token
          ? "Login thành công"
          : response
          ? "Password sai"
          : "Email không tồn tại",
        access_token: token ? `Bearer ${token}` : token,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });

export const loginSuccess = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Teacher.findOne({
        where: { id },
        raw: true,
      });
      const token =
        response &&
        jwt.sign(
          { id: response.id, email: response.email, role: response.role },
          process.env.JWT_SECRET,
          { expiresIn: "5d" } // time hết hạn của token
        ); // mã hóa
      resolve({
        err: token ? 0 : 1, //0 là true
        mes: token ? "thành công" : "Không tìm thấy người dùng",
        token,
      });
    } catch (error) {
      console.log(error);
      reject({
        err: 2,
        msg: "Fail at auth server" + error,
      });
    }
  });
