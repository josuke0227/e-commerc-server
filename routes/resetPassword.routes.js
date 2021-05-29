const Joi = require("joi");
const express = require("express");
const validate = require("../middleware/validate");
const { resetPassword } = require("../controllers/resetPassword.controllers");
const { passwordSchema } = require("../schemas/user.schemas");
const router = express.Router();

router.put("/", validate(validateUser), resetPassword);

function validateUser(user) {
  const schema = Joi.object({
    email: emailSchema,
    password: passwordSchema,
    confirmingPassword: Joi.ref("password"),
    token: tokenSchema,
  });

  return schema.validate(user);
}

module.exports = router;
