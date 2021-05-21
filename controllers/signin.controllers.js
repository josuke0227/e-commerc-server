const User = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");

exports.signin = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken(
    { _id: user._id },
    process.env.JWT_SECRET
  );

  res
    .status(200)
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "email", "role"]));
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
