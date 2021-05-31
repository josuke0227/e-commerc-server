const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const jwtSecretKey = process.env.JWT_SECRET;
    const { role } = jwt.verify(token, jwtSecretKey);
    if (role !== "admin") {
      return res.status(401).send("You are not authorized.");
    }
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
};
