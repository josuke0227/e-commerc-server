const express = require("express");
const { currentUser } = require("../controllers/auth.controller");
const adminRoute = require("../middleware/adminRoute");
const router = express.Router();

router.post("/", adminRoute, currentUser);

module.exports = router;
