const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validate = require("../middleware/validate");
const { update } = require("../controllers/user.controller");
const { getAddress } = require("../controllers/user.controller");
const userRoute = require("../middleware/userRoute");

router.put("/:id", [userRoute, validate(validateAddress)], update);
router.get("/:id", [userRoute], getAddress);

function validateAddress(variation) {
  const schema = Joi.object({
    address1: Joi.string().min(1).max(255),
    address2: Joi.string().min(1).max(255),
    city: Joi.string().min(1).max(255),
    country: Joi.string().min(1).max(255),
    isDefault: Boolean,
    name: Joi.string().min(1).max(255),
    phone: Joi.string()
      .pattern(/^([0-9])\w+$/)
      .min(1)
      .max(255),
    postcode: Joi.string()
      .pattern(/^([0-9])\w+$/)
      .min(1)
      .max(255),
    state: Joi.string().min(1).max(255),
  });

  return schema.validate(variation);
}

module.exports = router;
