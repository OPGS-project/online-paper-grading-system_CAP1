import teacher from "./teacher";
import auth from "./auth";
import { internalServerError } from "../middlewares/handle_errors";

const initRoutes = (app) => {
  app.use("/api/teacher", teacher);
  app.use("/api/auth", auth);

  app.use("/", internalServerError);
};
module.exports = initRoutes;
