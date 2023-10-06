const teacher = require("../controllers/teacher");
const router = require("express").Router();

router.get("/", teacher.getTeacher);

module.exports = router;
