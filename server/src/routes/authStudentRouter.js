import * as controllers from "../controllers";
import express from "express";
import verifyToken from "../middlewares/verify_token";

require("dotenv").config;

const router = express.Router();

router.post("/login", controllers.loginStudent);
router.use(verifyToken);

router.post("/change-password", controllers.changePasswordStudent);

module.exports = router;
