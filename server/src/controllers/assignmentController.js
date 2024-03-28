import * as authServices from "../services";
const cloudinary = require("cloudinary").v2;
import joi from "joi";

export const getAssignment = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await authServices.getAssignment(id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};

export const getAssignmentById = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const response = await authServices.getAssignmentById(assignmentId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const createAssignment = async (req, res) => {
  try {
    const fileData = req.file;
    const { id } = req.user;

    const { error } = joi.object().validate({ file_path: fileData?.path });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
    const response = await authServices.createAssignment(
      req.body,
      fileData,
      id
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};
export const updateAssignment = async (req, res) => {
  try {
    // console.log(req.body);
    const fileData = req.file;
    const assignmentId = req.params;
    const { error } = joi.object().validate({ avatar: fileData?.path });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
    const response = await authServices.updateAssignment(
      assignmentId,
      req.body,
      fileData
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const assignmentId = req.params;
    const response = await authServices.deleteAssignment(assignmentId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

// Add short assignment
export const addShortAssignment = async (req, res) => {
  try {
      const fileData = req.file;
      const { id } = req.user;

      const { error } = joi.object().validate({ file_path: fileData?.path });
      if (error) {
        if (fileData) cloudinary.uploader.destroy(fileData.filename);
      }

      if (!req.user || !req.user.id) {
          return res.status(401).json({ success: false, error: 'Xác thực không thành công.' });
      }

      // Kiểm tra xem assignment_name và short_answers đã được cung cấp hay chưa
      if (!req.body.assignment_name || !req.body.question_name) {
          return res.status(400).json({ success: false, error: 'Vui lòng cung cấp đầy đủ thông tin.' });
      }

      // Gọi hàm addShortAssignment từ service để thêm bài tập ngắn
      const message = await authServices.addShortAssignmentService(
        req.body,
        fileData,
        id
      );
      
      // Kiểm tra kết quả trả về từ service và phản hồi cho client tương ứng
      if (!message && message.err !== 0) {
        return res.status(500).json({ success: false, error: 'Thêm bài tập ngắn thất bại.' });
      }
      return res.status(200).json({ success: true, message: message.mes });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: 'Lỗi máy chủ .' });
  }
};

// export const createAssignment = async (req, res) => {
//   try {
//     const fileData = req.file;
//     const { id } = req.user;

//     const { error } = joi.object().validate({ file_path: fileData?.path });
//     if (error) {
//       if (fileData) cloudinary.uploader.destroy(fileData.filename);
//     }
//     const response = await authServices.createAssignment(
//       req.body,
//       fileData,
//       id
//     );
//     return res.status(200).json(response);
//   } catch (error) {
//     console.log(error);
//     // return internalServerError(res);
//   }
// };