import { where } from "sequelize";
import db from "../models";
import { of_class } from "../helpers/joi_schema";

//getAssignment of Student

export const getAssignmentOfStudent = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      let response = await db.Student.findOne({
        where: { id },
        raw: false,
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
        include: [
          {
            model: db.Class,
            attributes: ["class_name"],
            through: {
              model: db.Student_Class,
            },
            include: [
              {
                model: db.Assignment,
                where:{type_assignment: '0'},
                as: "assignmentData",
                attributes: ["assignment_name", "deadline", "id", "file_path","type_assignment",],
              },
            ],
          },
        ],
      });

      resolve({
        err: response ? 0 : 1,
        msg: response ? "OK" : "Student not found!",
        response,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
  export const getAssignmentShortService = (id) =>
    new Promise(async(resolve,reject) => {
      try {
        let response = await db.Student.findOne({
          where: { id },
          raw: false,
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
          include: [
            {
              model: db.Class,
              attributes: ["class_name","id"],
              through: {
                model: db.Student_Class,
              },
              include: [
                {
                  model: db.Assignment,
                  where:{type_assignment: '1'},
                  as: "assignmentData",
                  attributes: ["assignment_name", "deadline", "id","question_name","type_assignment"],
                },
              ],
            },
          ],
        });
  
        resolve({
          err: response ? 0 : 1,
          msg: response ? "OK" : "Student not found!",
          response,
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    })

    
    
    


export const getStudentCurrent = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      let response = await db.Student.findOne({
        where: { id },
        raw: true,
        attributes: {
          exclude: ["password", "refresh_token"],
        },
      });
      resolve({
        err: response ? 0 : 1,
        msg: response ? "OK" : "Student not found!",
        response,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });

  //get detail assignment
  export const getAssignmentShortDetail = (assignmentId, classId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const assignment = await db.Assignment.findOne({
          where: { id: assignmentId, of_class: classId },
          attributes: ['assignment_name', 'deadline', 'id', 'question_name'],
        });
  
        if (!assignment) {
          resolve({
            err: 1,
            msg: "Không có bài tập nào trong lớp",
          });
        } else {
          if (assignment.question_name) {
            assignment.question_name = JSON.parse(assignment.question_name);
          }
  
          resolve({
            err: 0,
            msg: "OK",
            assignment,
          });
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };
  //submit short assign
  
  export const submitAssignmentShortService = (body, studentId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra trạng thái nộp bài của học sinh 
            console.log(body.assignment_id)
            const existingSubmission = await db.Submit_short.findOne({
                where: {
                    student_id: studentId,
                    assignment_id: body.assignment_id
                }
                
            });
            // Nếu học sinh đã nộp bài cho bài tập này trước đó, từ chối yêu cầu nộp bài mới và trả về thông báo lỗi
            if (existingSubmission) {
               resolve({
                    errorCode: 1,
                    message: "Bạn đã nộp bài 1 lần rồi !"
                });
            }else{
              // Nếu học sinh chưa nộp bài cho bài tập này trước đó, tạo một bản ghi mới trong cơ sở dữ liệu
              const submission = await db.Submit_short.create({
                  ...body,
                  student_id: studentId,
                  assignment_id:  body.assignment_id,
                  submission_time: new Date(),
                  submission_status: 'Đã nộp',
              });
              console.log("submission", submission);
              resolve({
                  errorCode: 0,
                  message: "Nộp bài thành công",
                  submission
              });
            }



        } catch (error) {
            reject(error);
        }
    });
};
