import * as controllers from "../controllers";
import express from "express";

const router = express.Router();

router.get("/:assignment_id/:studentId", controllers.getCheckDoAssignShort);

module.exports = router;
