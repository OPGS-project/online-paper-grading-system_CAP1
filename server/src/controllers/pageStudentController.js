import * as authServices from "../services";

export const getAssignmentOfStudent = async (req, res) => {
  try {
    const { id } = req.user;
    console.log(id);
    const response = await authServices.getAssignmentOfStudent(id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};

export const getStudentCurrent = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await authServices.getStudentCurrent(id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};
