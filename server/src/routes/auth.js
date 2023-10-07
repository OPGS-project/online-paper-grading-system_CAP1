import * as controllers from "../controllers";
import express from "express";
require("dotenv").config;

const passport = require("passport");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", (err, profile) => {
      req.user = profile;
      next();
    })(req, res, next);
  },
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/login-success/${req.user?.id}`);
  }
);

router.post("/register", controllers.register);
router.post("/login", controllers.login);
router.post("/login-success", controllers.loginSuccess);

module.exports = router;
