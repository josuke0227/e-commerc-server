const Joi = require("joi");
const express = require("express");
const router = express.Router();
const {
  signin,
  googleSignin,
  facebookSignin,
} = require("../controllers/signin.controllers");
const validate = require("../middleware/validate");

router.post("/", validate(validateUser), signin);
router.post("/googleaccount", googleSignin);
router.post("/facebookaccount", facebookSignin);

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required()
      .label("Email"),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]"))
      .min(6)
      .max(30)
      .required(),
  });

  return schema.validate(user);
}

module.exports = router;
