const express = require("express");
const Joi = require("joi");
const router = express.Router();
const validate = require("../middleware/validate");
const {
  create,
  remove,
  update,
  getAll,
} = require("../controllers/categories.controller");
const adminRoute = require("../middleware/adminRoute");

router.get("/", getAll);
router.post("/create", [adminRoute, validate(validateCategory)], create);
router.delete("/remove/:slug", adminRoute, remove);
router.put("/update/:slug", [adminRoute, validate(validateCategory)], update);

function validateCategory(category) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(50),
  });

  return schema.validate(category);
}

module.exports = router;
