const teacher = require("../controllers/teacherController");
const router = require("express").Router();
import uploadCloud from "../middlewares/uploader";
import verifyToken from "../middlewares/verify_token";
// import { isTeacher } from "../middlewares/verify_role";
// import uploadCloud from "../middlewares/uploader";

// router.use(verifyToken);
router.get("/", teacher.getTeacher);
router.get("/:tid", teacher.getTeacherById);
router.put(
  "/update-teacher/:tid",
  uploadCloud.single("avatar"),
  teacher.updateTeacher
);

module.exports = router;
