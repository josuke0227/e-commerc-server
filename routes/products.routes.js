const express = require("express");

const router = express.Router();

const adminRoute = require("../middleware/adminRoute");
const userRoute = require("../middleware/userRoute");

const {
  create,
  products,
  update,
  product,
  delete: deleteProduct,
  rating,
  filterByAttribute,
} = require("../controllers/products.controllers");

router.post("/", adminRoute, create);
router.get("/", products);
router.get("/:slug", product);
router.put("/:slug", adminRoute, update);
router.put("/rating/:productId", userRoute, rating);
router.delete("/:slug", adminRoute, deleteProduct);
router.post("/search/attributes", filterByAttribute);

module.exports = router;
