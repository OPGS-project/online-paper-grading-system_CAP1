import teacher from "./teacherRouter";
import auth from "./auth";
import assignment from "./assignmentRouter";
import classes from "./classRouter";
import student from "./studentRouter";
import { internalServerError } from "../middlewares/handle_errors";

const initRoutes = (app) => {
  app.use("/api/teacher", teacher);
  app.use("/api/auth", auth);
  app.use("/api/assignment", assignment);
  app.use("/api/class", classes);
  app.use("/api/student", student);

  app.use("/", internalServerError);
};
module.exports = initRoutes;
