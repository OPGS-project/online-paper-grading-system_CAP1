import * as controllers from "../controllers";
import express from "express";
import upload from "../middlewares/upload";
import verifyToken from "../middlewares/verify_token";
import { uploadUser } from "../middlewares/uploader";

const router = express.Router();

router.get("/:cid", controllers.getStudent);
router.post("/", controllers.createStudent);
router.put("/update-student/:classId/:studentId", controllers.updateStudent);
router.delete("/delete-student/:studentId", controllers.deleteStudent);

router.post("/upload-csv/:classId", upload.single("csvFile"), controllers.uploadCSV);
router.post("/upload-short-csv", upload.single("csvFile"), controllers.importShortExamCsv);

router.use(verifyToken);
// router.get("/get-student", controllers.getStudentCurrent);
router.put(
  "/update-student-profile",

  uploadUser.single("avatar"),
  controllers.updateStudentProfile
);

// router.get("/get-assignment-of-student", controllers.getAssignmentOfStudent);

module.exports = router;
