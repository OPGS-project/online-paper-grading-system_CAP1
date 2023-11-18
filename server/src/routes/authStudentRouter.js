import * as controllers from "../controllers";
import express from "express";
require("dotenv").config;

const router = express.Router();

router.post("/register", controllers.registerStudent);
router.post("/login", controllers.loginStudent);
router.post("/reset-password", controllers.resetPasswordStudent);
router.post("/change-password", controllers.changePasswordStudent);

module.exports = router;
