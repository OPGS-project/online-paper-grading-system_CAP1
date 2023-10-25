import * as controllers from "../controllers";
import express from "express";

const router = express.Router();

router.get("/", controllers.getCriteria);
router.post("/", controllers.createCriteria);
router.put("/update-criteria/:criteriaId", controllers.updateCriteria);
router.delete("/delete-criteria/:criteriaId", controllers.deleteCriteria);

module.exports = router;
