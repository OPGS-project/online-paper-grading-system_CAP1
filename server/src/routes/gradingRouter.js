import * as controllers from "../controllers";
import express from "express";
import { uploadGradedAssignments } from "../middlewares/uploader";
import verifyToken from "../middlewares/verify_token";

const router = express.Router();

// router.use(verifyToken)

router.post("/", uploadGradedAssignments.single("image"), controllers.saveGradedAssignments);
router.post("/graded-short", controllers.saveGradedAssignmentShort)
router.get("/:submissionId/:student_name", controllers.getGrade);//teacher page
router.get("/:idStudent/", controllers.getGradeById);// student page

// router.get("/get-graded-short/:idStudent",controllers.getGradedForStudent)
router.delete("/:gradingId", controllers.deleteAssignmentGraded);
router.put(
  "/:gradeId",
  uploadGradedAssignments.single("image"),
  controllers.updateGradedAssignment
);
router.post("/graded-short-auto", controllers.calculateSimilarity)
// Update grade short assignment

module.exports = router;