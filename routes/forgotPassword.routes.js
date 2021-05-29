const express = require("express");
const Joi = require("joi");
const router = express.Router();
const { forgotPassword } = require("../controllers/forgotPassword.controllers");
const validate = require("../middleware/validate");

router.put("/", validate(validateEmail), forgotPassword);

function validateEmail(req) {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required()
      .label("Email"),
  });

  return schema.validate(req);
}

module.exports = router;
