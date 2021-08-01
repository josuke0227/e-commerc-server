const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validate = require("../middleware/validate");
const { update } = require("../controllers/user.controller");

router.put("/:id", update);
// router.put("/:id", [validate(validateUser)], update);

function validateUser(variation) {
  const schema = Joi.object({
    address1: Joi.string().alphanum().min(1).max(50),
    address2: Joi.ref("address1"),
    city: Joi.string()
      .pattern(/^[a-z, ]+$/)
      .min(1)
      .max(50),
    country: Joi.ref("city"),
    isDefault: Boolean,
    name: Joi.string()
      .pattern(/^[a-z, ]+$/)
      .min(1)
      .max(50),
    phone: Joi.string().pattern(/^[a-z, ]+$/),
    postcode: Joi.ref("phone"),
    state: Joi.ref("city"),
  });

  return schema.validate(variation);
}

module.exports = router;
