import * as controllers from "../controllers";
import express from "express";
import verifyToken from "../middlewares/verify_token";

const router = express.Router();

router.get("/", verifyToken, controllers.getClasses);
// router.get('/:classID', controllers.getClassById);
router.get("/:classID", controllers.getStudentByClassId);
router.post("/", verifyToken, controllers.createNewClass);
router.put("/update-class/:classID", controllers.updateClass);
router.delete("/delete-class/:classID", controllers.deleteClass);

module.exports = router;
