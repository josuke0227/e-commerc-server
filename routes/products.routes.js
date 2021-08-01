const express = require("express");

const router = express.Router();

const adminRoute = require("../middleware/adminRoute");
const userRoute = require("../middleware/userRoute");

const {
  create,
  products,
  productsList,
  update,
  product,
  delete: deleteProduct,
  rating,
} = require("../controllers/products.controllers");

router.post("/", adminRoute, create);
router.get("/", products);
router.post("/list", productsList);
router.get("/:slug", product);
router.put("/:slug", adminRoute, update);
router.put("/rating/:productId", userRoute, rating);
router.delete("/:slug", adminRoute, deleteProduct);

module.exports = router;
