const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      max: 32,
    },
    accountOrigin: {
      type: String,
      default: "original",
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 1024,
    },
    resetPasswordLink: {
      data: String,
      default: "",
    },
    role: {
      type: String,
      default: "subscriber",
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = (payload, JWTkey, expirydate = "7d") => {
  const token = jwt.sign(payload, JWTkey, { expiresIn: expirydate });
  return token;
};

module.exports = mongoose.model("User", userSchema);
