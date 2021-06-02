const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.currentUser = async (req, res) => {
  const token = req.headers["x-auth-token"];

  try {
    const jwtSecretKey = process.env.JWT_SECRET;
    const { email } = jwt.verify(token, jwtSecretKey);

    User.findOne({ email }).exec((err, user) => {
      if (err) throw new Error(err);
      res.json(user);
    });
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
};
