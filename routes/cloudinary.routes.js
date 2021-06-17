const express = require("express");
const router = express.Router();
const adminRoute = require("../middleware/adminRoute");

const {
  upload,
  remove,
  images,
} = require("../controllers/cloudinary.contollers");

router.post("/upload", adminRoute, upload);
router.post("/remove", adminRoute, remove);
router.get("/:productId", adminRoute, images);

module.exports = router;
