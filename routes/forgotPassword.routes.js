const express = require("express");
const Joi = require("joi");
const router = express.Router();
const { forgotPassword } = require("../controllers/forgotPassword.controllers");
const validate = require("../middleware/validate");
const { emailSchema } = require("../schemas/user.schemas");

router.put("/", validate(validateEmail), forgotPassword);

function validateEmail(req) {
  const schema = Joi.object({
    email: emailSchema,
  });

  return schema.validate(req);
}

module.exports = router;
