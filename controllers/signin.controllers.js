const User = require("../models/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");

exports.signin = async (req, res) => {
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

exports.googleSignin = async (req, res) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const { idToken } = req.body;

  try {
    const { payload } = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const user = await User.findOne({ email: payload.email });

    if (!user)
      return res
        .status(400)
        .send("Couldn't find user. Please signup or choose another account.");

    if (user.accountOrigin !== "Google") {
      const message = getSigninHint(user.accountOrigin);
      return res.status(400).send(message);
    }

    const token = user.generateAuthToken(
      { _id: user._id },
      process.env.JWT_SECRET
    );

    res
      .status(200)
      .header("x-auth-token", token)
      .send(_.pick(user, ["_id", "email", "role"]));
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.facebookSignin = async (req, res) => {
  let { userID, accessToken } = req.body;

  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

  try {
    const { data } = await axios(url, { method: "GET" });

    const user = await User.findOne({ email: data.email });
    if (!user) {
      return res
        .status(400)
        .send("Couldn't find user. Please signup or choose another account.");
    }

    if (user.accountOrigin !== "Facebook") {
      const message = getSigninHint(user.accountOrigin);
      return res.status(400).send(message);
    }

    const token = user.generateAuthToken(
      { _id: user._id },
      process.env.JWT_SECRET
    );

    res
      .status(200)
      .header("x-auth-token", token)
      .send(_.pick(user, ["_id", "email", "role"]));
  } catch (error) {
    return res.status(400).send("Login failded");
  }
};

function getSigninHint(accountOrigin) {
  let accountType;

  if (accountOrigin !== "original") {
    accountType = `${accountOrigin} account.`;
  } else {
    accountType = "email / password";
  }

  return `Seems like you have registered with us using ${accountType}. Please try agan.`;
}
