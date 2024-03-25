import * as controllers from "../controllers";
import express from "express";
import { uploadGradedAssignments } from "../middlewares/uploader";
import  verifyToken  from "../middlewares/verify_token";

const router = express.Router();

// router.use(verifyToken)

router.post("/", uploadGradedAssignments.single("image"),controllers.saveGradedAssignments);
router.get("/:submissionId/:student_name", controllers.getGrade);
router.get("/:idStudent", controllers.getGradeById);
router.delete("/:gradingId", controllers.deleteAssignmentGraded);
router.put(
    "/:gradeId",
    uploadGradedAssignments.single("image"),
    controllers.updateGradedAssignment
  );

module.exports = router;