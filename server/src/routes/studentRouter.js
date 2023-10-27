import * as controllers from "../controllers";
import express from "express";

const router = express.Router();

router.get("/", controllers.getStudent);
router.post("/", controllers.createStudent);
router.put("/update-student/:studentId", controllers.updateStudent);
router.delete("/delete-student/:studentId", controllers.deleteStudent);

module.exports = router;
