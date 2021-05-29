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
const { nameSchema } = require("../schemas/user.schemas");

router.get("/", getAll);
router.post("/create", validate(validateCategory), create);
router.delete("/remove/:slug", remove);
router.put("/update/:slug", validate(validateCategory), update);

function validateCategory(category) {
  const schema = Joi.object({
    name: nameSchema,
  });

  return schema.validate(category);
}

module.exports = router;
