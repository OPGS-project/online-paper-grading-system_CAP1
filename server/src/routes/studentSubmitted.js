import * as controllers from "../controllers";
import express from "express";
import  verifyToken  from "../middlewares/verify_token";

const router = express.Router();

// router.use(verifyToken)

router.get("/:assignmentId", controllers.getStudentSubmittedById);

router.get("/short/:assignment_id",controllers.getSubmitShort)
module.exports = router;