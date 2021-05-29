const express = require("express");
const Joi = require("joi");
const router = express.Router();
const {
  accountActivation,
} = require("../controllers/accountActivation.controller");
const validate = require("../middleware/validate");

router.post("/", validate(validateUser), accountActivation);

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
