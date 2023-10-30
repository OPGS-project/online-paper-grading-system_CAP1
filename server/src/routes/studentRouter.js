import * as controllers from "../controllers";
import express from "express";

const router = express.Router();

router.get("/", controllers.getStudent);

// router.get("/:studentId", controllers.getStudentById);

router.post("/", controllers.createStudent);
router.put("/update-student/:classId/:studentId", controllers.updateStudent);
router.delete("/delete-student/:studentId", controllers.deleteStudent);

module.exports = router;
