const express = require("express");
const Joi = require("joi");
const router = express.Router();
const validate = require("../middleware/validate");
const {
  create,
  read,
  update,
  remove,
} = require("../controllers/variations.controllers");

router.get("/", read);
router.post("/", [validate(validateVariation)], create);
router.put("/:slug", [validate(validateVariation)], update);
router.delete("/:slug", remove);

function validateVariation(user) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(50),
    instances: Joi.array().items(
      Joi.object({ index: Joi.number(), name: Joi.string() })
    ),
  });

  return schema.validate(user);
}

module.exports = router;
