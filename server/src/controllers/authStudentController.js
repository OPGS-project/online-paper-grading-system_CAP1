import * as authServices from "../services";

export const loginStudent = async (req, res) => {
  try {
    const response = await authServices.loginStudent(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};

//
export const changePasswordStudent = async (req, res) => {
  try {
    const { id } = req.user;
    // console.log(req.user);
    const response = await authServices.changePasswordStudent(req.body, id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
