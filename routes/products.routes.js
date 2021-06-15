const express = require("express");

const router = express.Router();

const adminRoute = require("../middleware/adminRoute");

const {
  create,
  products,
  update,
  delete: deleteProduct,
} = require("../controllers/products.controllers");

router.post("/", adminRoute, create);
router.get("/", products);
router.put("/:slug", adminRoute, update);
router.delete("/:slug", adminRoute, deleteProduct);

module.exports = router;
