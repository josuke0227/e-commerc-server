const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/signup.controllers");
const {
  googleSignup,
  facebookSignup,
} = require("../controllers/signup.controllers");

router.post("/", signup);
router.post("/googleaccount", googleSignup);
router.post("/facebookaccount", facebookSignup);

module.exports = router;
