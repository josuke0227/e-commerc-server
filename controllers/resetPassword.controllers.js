const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.resetPassword = async (req, res) => {
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
