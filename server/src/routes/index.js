import teacher from "./teacherRouter";
import auth from "./auth";
import authStudent from "./authStudentRouter";
import assignment from "./assignmentRouter";
import classes from "./classRouter";
import student from "./studentRouter";
import submission from "./submissionRouter";
import grading from "./gradingRouter";
import gradingShort from "./gradingShortRouter";
import submiss from "./submission";
import studentSubmitted from "./studentSubmitted";
import mainStudent from "./pageStudentRouter";
import statis from "./statisRouter";
import resultAssignment from "./resultAssignmentRouter";
import checkDoAssignShort from "./checkDoAssignShortRouter";
import checkDoAssign from "./checkDoAssignRouter";

import { internalServerError } from "../middlewares/handle_errors";

const initRoutes = (app) => {
  app.use("/api/teacher", teacher);
  app.use("/api/auth", auth);
  app.use("/api/authStudent", authStudent);
  app.use("/api/assignment", assignment);
  app.use("/api/submission", submission);
  app.use("/api/class", classes);
  app.use("/api/student", student);
  app.use("/api/grading", grading);
  app.use("/api/gradingShort", gradingShort);
  app.use("/api/submiss", submiss);
  app.use("/api/studentSubmitted", studentSubmitted);
  app.use("/api/main-student", mainStudent);
  app.use("/api/short-assignment",assignment);
  app.use("/api/statis", statis);
  app.use("/api/resultAssignment", resultAssignment);
  app.use("/api/checkDoAssignShort", checkDoAssignShort);
  app.use("/api/checkDoAssign", checkDoAssign);

  // app.use("/", internalServerError);
};
module.exports = initRoutes;
