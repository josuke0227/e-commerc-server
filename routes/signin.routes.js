const Joi = require("joi");
const express = require("express");
const router = express.Router();
const {
  signin,
  googleSignin,
  facebookSignin,
} = require("../controllers/signin.controllers");
const validate = require("../middleware/validate");
const { emailSchema, passwordSchema } = require("../schemas/user.schemas");

router.post("/", validate(validateUser), signin);
router.post("/googleaccount", googleSignin);
router.post("/facebookaccount", facebookSignin);

function validateUser(user) {
  const schema = Joi.object({
    email: emailSchema,
    password: passwordSchema,
  });

  return schema.validate(user);
}

module.exports = router;
