import * as controllers from "../controllers";
import express from "express";
import verifyToken from "../middlewares/verify_token";
// import { uploadAssignment } from "../middlewares/uploader";

const router = express.Router();

// router.use(verifyToken);

router.get("/:submissionId/:student_name", controllers.getGradeShort);//teacher page
router.put("/update-graded/:gradeId", controllers.updateGradedShortAssignment);
module.exports = router;