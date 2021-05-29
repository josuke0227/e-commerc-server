const express = require("express");
const router = express.Router();
const {
  create,
  remove,
  update,
  getAll,
} = require("../controllers/categories.controller");

router.get("/", getAll);
router.post("/create", create);
router.delete("/remove/:slug", remove);
router.put("/update/:slug", update);

module.exports = router;
