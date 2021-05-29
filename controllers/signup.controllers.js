const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const sgMail = require("@sendgrid/mail");
const User = require("../models/user");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const _ = require("lodash");
const bcrypt = require("bcrypt");
const axios = require("axios");

exports.signup = async (req, res) => {
  const { email } = req.body;

  let user = await User.findOne({ email });
  if (user) return res.status(400).send("Email is taken");

  const token = jwt.sign(
    {
      email,
    },
    process.env.JWT_ACCOUNT_ACTIVATION,
    { expiresIn: "10m" }
  );

  const emailData = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Account activation link`,
    html: `
      <h1>Please use the following link to activate your account</h1>
      <p>${process.env.CLIENT_URL}/activate/${token}</p>
      <hr />
      <p>This email may contain sensitive infomation</p>
      <p>${process.env.CLIENT_URL}</p>
    `,
  };

  try {
    await sgMail.send(emailData);
    return res
      .status(200)
      .send(
        `Activation Email has sent to "${email}". Please follow the instruction to activate your account.`
      );
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.googleSignup = async (req, res) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const { idToken } = req.body;

  const { payload } = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const isValidEmail = payload.email_verified;
  if (!isValidEmail) {
    return res.status(400).send("Invalid google account.");
  }

  const userExists = await User.findOne({ email: payload.email });
  if (userExists) {
    return res.status(400).send("Email is taken.");
  }

  const userData = _.pick(payload, ["name", "email"]);
  userData.accountOrigin = "Google";
  console.log(`userData`, userData);
  const salt = await bcrypt.genSalt(10);
  userData.password = await bcrypt.hash(payload.email, salt);

  try {
    const user = new User(userData);
    await user.save();

    delete userData.password;
    const token = user.generateAuthToken(userData, process.env.JWT_SECRET);
    return res
      .header("x-auth-token", token)
      .send(_.pick(user, ["_id", "name", "email"]));
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.facebookSignup = async (req, res) => {
  let { userID, accessToken } = req.body;

  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

  try {
    const { data } = await axios(url, { method: "GET" });

    const { name, email } = data;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send("Email is taken.");
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(email, salt);
    const accountOrigin = "Facebook";
    const userData = { name, email, password, accountOrigin };

    try {
      const user = new User(userData);
      await user.save();

      delete userData.password;
      const token = user.generateAuthToken(userData, process.env.JWT_SECRET);
      return res
        .header("x-auth-token", token)
        .send(_.pick(user, ["_id", "name", "email"]));
    } catch (error) {
      return res.status(400).send(error);
    }
  } catch (error) {
    return res.status(400).send("Login failded");
  }
};
