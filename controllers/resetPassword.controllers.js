const User = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.resetPassword = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { token, password: newPassword } = req.body;

  try {
    jwt.verify(token, process.env.JWT_RESET_PASSWORD);
    const user = await User.findOne({ resetPasswordLink: token });
    console.log(`user`, user);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordLink = "";
    await user.save();
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(400).send("Expired link. Try again");
  }
};

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
