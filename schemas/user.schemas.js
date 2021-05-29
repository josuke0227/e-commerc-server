const Joi = require("joi");

exports.emailSchema = Joi.string().email({
  minDomainSegments: 2,
  tlds: { allow: ["com", "net"] },
});

exports.passwordSchema = Joi.string()
  .pattern(new RegExp("^[a-zA-Z0-9]"))
  .min(6)
  .max(30);

exports.tokenSchema = Joi.string();

exports.nameSchema = Joi.string().min(1).max(6);
