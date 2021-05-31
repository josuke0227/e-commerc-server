const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pickUserCredential } = require("../util/controllers.util");

exports.resetPassword = async (req, res) => {
  const { token, password: newPassword } = req.body;

  try {
    jwt.verify(token, process.env.JWT_RESET_PASSWORD);

    const user = await User.findOne({ resetPasswordLink: token });
    if (!user) {
      return res.status(400).send("Invalid link. Try again");
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordLink = "";
    await user.save();

    const userCredential = { ...pickUserCredential(user) };
    const newToken = user.generateAuthToken(
      { ...userCredential },
      process.env.JWT_SECRET
    );

    return res
      .status(200)
      .header("x-auth-token", newToken)
      .send({ ...userCredential });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Expired link. Try again");
  }
};
