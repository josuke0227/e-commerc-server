const express = require("express");
const router = express.Router();
const adminRoute = require("../middleware/adminRoute");

const {
  upload,
  remove,
  images,
} = require("../controllers/cloudinary.contollers");

router.post("/upload", adminRoute, upload);
router.delete("/:public_id", adminRoute, remove);
router.get("/:productId", images);

module.exports = router;
