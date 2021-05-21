const User = require("../models/user");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

exports.accountActivation = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { token, email, password } = req.body;

  try {
    const { email: jwtEmailData } = jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION
    );
    if (jwtEmailData !== email)
      return res.status(400).json({
        error: "Invalid data",
      });
  } catch (error) {
    console.log("jwt decoding error", error);
    return res.status(401).send("Expired link. Please signup again.");
  }

  try {
    const user = new User({ email, password });
    await user.save();
    res.status(200).send();
  } catch (error) {
    res.status(400).send("User is already registered.");
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
