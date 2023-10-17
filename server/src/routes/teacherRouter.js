const teacher = require("../controllers/teacherController");
const router = require("express").Router();
import verifyToken from "../middlewares/verify_token";
// import { isTeacher } from "../middlewares/verify_role";

router.get("/", [verifyToken], teacher.getTeacher);

module.exports = router;
