import * as controllers from "../controllers";
import express from "express";
import  verifyToken  from "../middlewares/verify_token";

const router = express.Router();

// router.use(verifyToken)

router.get("/:studentId", controllers.get_submission_ById);

module.exports = router;