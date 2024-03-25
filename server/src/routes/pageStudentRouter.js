import verifyToken from "../middlewares/verify_token";
import * as controllers from "../controllers";
import express from "express";
const router = express.Router();

router.get(
  "/get-assignment-of-student",
  verifyToken,
  controllers.getAssignmentOfStudent
);

router.get("/get-student", verifyToken, controllers.getStudentCurrent);

module.exports = router;
