const Joi = require("joi");
const express = require("express");
const router = express.Router();
const {
  signup,
  googleSignup,
  facebookSignup,
} = require("../controllers/signup.controllers");
const validate = require("../middleware/validate");

router.post("/", validate(validateEmail), signup);
router.post("/googleaccount", googleSignup);
router.post("/facebookaccount", facebookSignup);

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
