const controllers = require("../controllers/teacherController");
const router = require("express").Router();
import { uploadUser } from "../middlewares/uploader";
import verifyToken from "../middlewares/verify_token";
import { isTeacher } from "../middlewares/verify_role";

router.use(verifyToken);
router.get("/", controllers.getTeacher);

router.put(
  "/update-teacher",

  uploadUser.single("avatar"),
  controllers.updateTeacher
);

module.exports = router;
