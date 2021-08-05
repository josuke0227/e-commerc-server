const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validate = require("../middleware/validate");
const {
  registerAddress,
  getAddress,
  changeDefaultAddress,
} = require("../controllers/user.controller");
Joi.ObjectId = require("joi-objectid")(Joi);
const userRoute = require("../middleware/userRoute");

router.put(
  "/address/register/:id",
  [userRoute, validate(validateAddress)],
  registerAddress
);
router.put(
  "/address/changedefault/:id",
  [userRoute, validate(validateAddress)],
  changeDefaultAddress
);
router.get("/address/:id", [userRoute], getAddress);

function validateAddress(address) {
  const schema = Joi.array().items(
    Joi.object({
      _id: Joi.ObjectId(),
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
    })
  );

  return schema.validate(address);
}

module.exports = router;
