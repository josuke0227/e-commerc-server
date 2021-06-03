const express = require("express");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const router = express.Router();
const validate = require("../middleware/validate");
const {
  create,
  remove,
  update,
  getAll,
} = require("../controllers/subCategories.controllers");
const adminRoute = require("../middleware/adminRoute");

router.get("/", getAll);
router.post("/", [adminRoute, validate(validateSubCategory)], create);
// TODO: rename endpont: /:slug
router.delete("/:slug", adminRoute, remove);
router.put("/:slug", [adminRoute, validate(validateSubCategory)], update);

function validateSubCategory(category) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(50),
    parent: Joi.objectId(),
  });

  return schema.validate(category);
}
module.exports = router;
