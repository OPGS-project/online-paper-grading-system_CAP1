import * as controllers from "../controllers";
import express from "express";

const router = express.Router();

router.get("/:studentId/:classId", controllers.getResultGrade);// student page

module.exports = router;