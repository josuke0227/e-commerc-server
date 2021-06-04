const express = require("express");
const Joi = require("joi");
Joi.ObjectId = require("joi-objectid")(Joi);
const router = express.Router();
const validate = require("../middleware/validate");
const {
  create,
  remove,
  update,
  getSubCategories,
  pickByParentId,
} = require("../controllers/subCategories.controllers");
const adminRoute = require("../middleware/adminRoute");

router.get("/", getSubCategories);
router.get("/:parentId", pickByParentId);
router.post("/", [adminRoute, validate(validateSubCategory)], create);
router.delete("/:slug", adminRoute, remove);
router.put("/:slug", [adminRoute, validate(validateSubCategory)], update);

function validateSubCategory(subCategory) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(50),
    slug: Joi.string(),
    parent: Joi.ObjectId().required(),
  });

  return schema.validate(subCategory);
}
module.exports = router;
