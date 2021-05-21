const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

exports.signin = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send("Invalid email or password.");

  const isValidPassword = user.authenticate(req.body.password);
  if (!isValidPassword)
    return res.status(400).send("Invalid email or password.");

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const { _id, name, email, role } = user;

  res.json({
    token,
    user: { _id, name, email, role },
  });
};

function validate(req) {
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

  return schema.validate(req);
}
