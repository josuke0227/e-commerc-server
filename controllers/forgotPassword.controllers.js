const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const User = require("../models/user");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.forgotPassword = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email does not exist.");

  const { email } = req.body;

  const token = user.generateAuthToken(
    pickUserCredential(user),
    process.env.JWT_RESET_PASSWORD
  );

  const emailData = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Password reset link`,
    html: `
      <h1>Please use the following link to reset password</h1>
      <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>
      <hr />
      <p>This email may contain sensitive infomation</p>
      <p>${process.env.CLIENT_URL}</p>
    `,
  };

  try {
    await user.updateOne({ resetPasswordLink: token });
    await sgMail.send(emailData);
    return res
      .status(200)
      .send(
        `Email has been sent to ${email}. Follow the instruction to reset password.`
      );
  } catch (error) {
    return res.status(500).send(error);
  }
};
