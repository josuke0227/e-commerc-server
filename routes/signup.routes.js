const Joi = require("joi");
const express = require("express");
const router = express.Router();
const {
  signup,
  googleSignup,
  facebookSignup,
} = require("../controllers/signup.controllers");
const validate = require("../middleware/validate");
const { emailSchema } = require("../schemas/user.schemas");

router.post("/", validate(validateEmail), signup);
router.post("/googleaccount", googleSignup);
router.post("/facebookaccount", facebookSignup);

function validateEmail(req) {
  const schema = Joi.object({
    email: emailSchema,
  });

  return schema.validate(req);
}

module.exports = router;
