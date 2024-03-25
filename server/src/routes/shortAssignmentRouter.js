import * as controllers from "../controllers";
import verifyToken from "../middlewares/verify_token";

import express from "express";
const router = express.Router();
router.use(verifyToken);
router.post("/add-short-assignment",controllers.addShortAssignment)
module.exports = router;