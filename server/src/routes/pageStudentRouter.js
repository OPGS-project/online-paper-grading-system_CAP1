import verifyToken from "../middlewares/verify_token";
import * as controllers from "../controllers";
import express from "express";
const router = express.Router();

router.get(
  "/get-assignment-of-student",
  verifyToken,
  controllers.getAssignmentOfStudent
);
router.get("/get-short-assignment" ,verifyToken,controllers.getAssignmentShort)
router.get("/get-detail-shortass/:assignmentId/:classId",controllers.getAssignmentShortDetail)

router.get("/get-student", verifyToken, controllers.getStudentCurrent);
//submit assignemnt short
router.post("/submit-short" ,verifyToken ,controllers.submitAssignmentShort)
// get graded for student page return assignment short 
router.get("/get-graded-short/:idStudent",controllers.getGradedForStudent)
module.exports = router;
