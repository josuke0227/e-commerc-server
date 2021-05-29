const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

exports.accountActivation = async (req, res) => {
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

  const user = new User({ email, password });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  const newToken = user.generateAuthToken(
    { id: user._id, email },
    process.env.JWT_SECRET
  );
  res
    .status(200)
    .header("x-auth-token", newToken)
    .send(_.pick(user, ["_id", "email", "role"]));
};
