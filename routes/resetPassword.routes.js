const Joi = require("joi");
const express = require("express");
const { resetPassword } = require("../controllers/resetPassword.controllers");
const router = express.Router();

router.put("/", resetPassword);

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]"))
      .min(6)
      .max(30)
      .required(),
    confirmingPassword: Joi.ref("password"),
    token: Joi.string().required(),
  });

  return schema.validate(user);
}

module.exports = router;
