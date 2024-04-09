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
export const getAssignmentShort =async (req , res) =>{
  try {
    const { id } = req.user;
    console.log(id);
    const response = await authServices.getAssignmentShortService(id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    
  }
}

// get assignment chi tiết
export const getAssignmentShortDetail = async(req, res) =>{
  try {
    const {assignmentId ,classId} = req.params;
    const response = await authServices.getAssignmentShortDetail(assignmentId, classId);
    return res.status(200).json(response)
  } catch (error) {
    console.log(error)
  }
}

export const getStudentCurrent = async (req, res) => {
  try {
    const { id } = req.user;
    console.log(id)
    const response = await authServices.getStudentCurrent(id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return internalServerError(res);
  }
};
