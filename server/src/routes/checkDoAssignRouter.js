import * as controllers from "../controllers";
import express from "express";

const router = express.Router();

router.get("/:assignment_id/:studentId", controllers.getCheckDoAssign);

module.exports = router;
