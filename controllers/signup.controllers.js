const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const User = require("../models/user");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.signup = async (req, res) => {
  // TODO: verify email here too.
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).send("Email is taken");
  } catch (error) {
    return res.status(500).send(error);
  }

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
  } catch (error) {
    return res.status(500).send(error);
  }
  res
    .status(200)
    .send(
      `Activation Email has sent to "${email}". Please follow the instruction to activate your account.`
    );
};
