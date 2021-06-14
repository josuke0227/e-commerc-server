const express = require("express");

const router = express.Router();

const adminRoute = require("../middleware/adminRoute");

const { create, products } = require("../controllers/products.controllers");

router.post("/", adminRoute, create);
router.get("/", products);

module.exports = router;
