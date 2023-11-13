import * as controllers from "../controllers";
import express from "express";
import upload from '../middlewares/upload';

const router = express.Router();

router.get("/", controllers.getStudent);

router.post("/", controllers.createStudent);
router.put("/update-student/:classId/:studentId", controllers.updateStudent);
router.delete("/delete-student/:studentId", controllers.deleteStudent);

router.post('/upload-csv', upload.single('csvFile'), controllers.uploadCSV);
module.exports = router;
