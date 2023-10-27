import * as controllers from "../controllers";
import express from "express";
import verifyToken from "../middlewares/verify_token";
// import { isTeacher } from "../middlewares/verify_role";
// import uploadCloud from "../middlewares/uploader";

const router = express.Router();

router.get("/", controllers.getAssignment);
router.get("/:assignmentId", controllers.getAssignmentById);

//PRIVATE ROUTER
// router.use(verifyToken);
// router.use(isTeacher);
router.post("/", controllers.createAssignment);
router.put("/:assignmentId", controllers.updateAssignment);
router.delete("/:assignmentId", controllers.deleteAssignment);

// router.post("/", uploadCloud.single("image"), controllers.createNewBook);
// router.put("/", uploadCloud.single("image"), controllers.updateBook);
// router.delete("/", controllers.deleteBook);

module.exports = router;
