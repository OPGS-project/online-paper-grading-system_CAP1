import * as controllers from "../controllers";
import express from "express";
import verifyToken from "../middlewares/verify_token";

const router = express.Router();

router.get("/", controllers.getStudent);

router.post("/", controllers.createStudent);
router.put("/update-student/:classId/:studentId", controllers.updateStudent);
router.delete("/delete-student/:studentId", controllers.deleteStudent);

router.use(verifyToken);
router.get("/get-student", controllers.getStudentCurrent);

module.exports = router;
