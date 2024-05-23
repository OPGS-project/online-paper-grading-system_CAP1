import * as controllers from "../controllers";
import express from "express";

const router = express.Router();

router.get("/:classId/", controllers.getScore);// teacher page

module.exports = router;