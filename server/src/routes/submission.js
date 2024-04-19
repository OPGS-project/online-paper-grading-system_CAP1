import * as controllers from "../controllers";
import express from "express";
import  verifyToken  from "../middlewares/verify_token";

const router = express.Router();

// router.use(verifyToken)

router.get("/:assignment_id/:studentId/", controllers.get_submission_ById);
router.get("/short-get/:assignment_id/:studentId/",controllers.getSubmitGradingShort)
// router.get("/:studentId/", controllers.checkSubmission);


module.exports = router;