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
  // export const submitAssignmentShortService = async (classId,id,studentName,assignmentId,answer ) => {
  //   try {
  //     const answerJson = JSON.stringify(answer)
  //     console.log("classId",classId)
  //     console.log("id",id)
  //     console.log("assignmentId",assignmentId)
  //     console.log("answer",answer)
  //       const submission= await db.Submit_short.create({
  //         class_id:classId,
  //         student_id:id,
  //         student_name:studentName,
  //         assignment_id:assignmentId,
  //         submission_time: new Date(),
  //         submission_status: 'Đã nộp',
  //         answer_short:answerJson
      
  //       });
  //       console.log(submission);
  //        // In ra đối tượng submission

  //       return {
  //           errorCode: 0,
  //           message: "Submission successful",
  //           submission
  //            // Trả về thông tin của bài tập đã nộp
            
  //       };
        
  //   } catch (error) {
  //       console.error(error);
  //       throw new Error("Error submitting assignment");
  //   }
  // };

  export const submitAssignmentShortService = (body,id ) => {
    return new Promise(async(resolve,reject) =>{
      try {
        const submission= await db.Submit_short.create({
         ...body,
          student_id:id,
          submission_time: new Date(),
          submission_status: 'Đã nộp',
        });
        console.log("submission",submission);
        
        resolve({

          errorCode: 0,
          message: "Submission successful",
          submission
        })

    } catch (error) {
       reject(error);
        
    }
    })
  };