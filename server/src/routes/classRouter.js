import * as controllers from "../controllers";
import express from "express";

const router = express.Router();

router.get("/", controllers.getClasses);
// router.get('/:classID', controllers.getClassById);
router.get("/:classID", controllers.getStudentByClassId);
router.post("/", controllers.createNewClass);
router.put("/update-class/:classID", controllers.updateClass);
router.delete("/delete-class/:classID", controllers.deleteClass);

module.exports = router;
