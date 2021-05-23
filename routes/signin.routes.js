const express = require("express");
const router = express.Router();
const {
  signin,
  googleSignin,
  facebookSignin,
} = require("../controllers/signin.controllers");

router.post("/", signin);
router.post("/googleaccount", googleSignin);
router.post("/facebookaccount", facebookSignin);

module.exports = router;
