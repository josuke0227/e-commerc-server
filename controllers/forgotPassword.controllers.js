const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const User = require("../models/user");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const Joi = require("joi");

exports.forgotPassword = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email does not exist.");

  const { email } = req.body;

  const token = jwt.sign({ email }, process.env.JWT_RESET_PASSWORD, {
    expiresIn: "10m",
  });

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

function validate(req) {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required()
      .label("Email"),
  });

  return schema.validate(req);
}
