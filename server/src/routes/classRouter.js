import * as controllers from "../controllers";
import express from "express";

const router = express.Router();

router.get("/", controllers.getClasses);
router.post("/", controllers.createNewClass);

module.exports = router;
