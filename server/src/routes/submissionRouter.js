import * as controllers from "../controllers";
import express from "express";
import { uploadUser } from "../middlewares/uploader";
import  verifyToken  from "../middlewares/verify_token";

const router = express.Router();

router.use(verifyToken)

router.get("/", controllers.getSubmission)

router.get("/:assignment_id", controllers.getSubmissionById)

 router.post("/",uploadUser.array("image")  ,controllers.uploadSubmission);
 
module.exports = router;