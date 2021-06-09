const express = require("express");

const router = express.Router();

const adminRoute = require("../middleware/adminRoute");

const { create } = require("../controllers/products.controllers");

router.post("/", adminRoute, create);

module.exports = router;
