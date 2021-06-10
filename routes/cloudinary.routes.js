const express = require("express");
const router = express.Router();
const adminRoute = require("../middleware/adminRoute");

const { upload, remove } = require("../controllers/cloudinary.contollers");

router.post("/upload", adminRoute, upload);
router.post("/remove", adminRoute, remove);

module.exports = router;
