import * as controllers from "../controllers";

import express from "express";
const router = express.Router();





router.post("/add-short-assignment",controllers.addShortAssignment)
module.exports = router;