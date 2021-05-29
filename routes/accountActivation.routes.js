const express = require("express");
const Joi = require("joi");
const router = express.Router();
const {
  accountActivation,
} = require("../controllers/accountActivation.controller");
const validate = require("../middleware/validate");
const {
  emailSchema,
  passwordSchema,
  tokenSchema,
} = require("../schemas/user.schemas");

router.post("/", validate(validateUser), accountActivation);

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
