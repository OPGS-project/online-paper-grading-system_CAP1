import * as controllers from "../controllers";
import express from "express";
import verifyToken from "../middlewares/verify_token";
import { uploadAssignment } from "../middlewares/uploader";
// import { isTeacher } from "../middlewares/verify_role";
// import uploadCloud from "../middlewares/uploader";

const router = express.Router();

router.use(verifyToken);

router.get("/", controllers.getAssignment);
router.get("/:assignmentId", controllers.getAssignmentById);

//PRIVATE ROUTER
router.post(
  "/",
  uploadAssignment.single("file_path"),
  controllers.createAssignment
);

router.put(
  "/:assignmentId",
  uploadAssignment.single("file_path"),
  controllers.updateAssignment
);

router.delete("/:assignmentId", controllers.deleteAssignment);

module.exports = router;
