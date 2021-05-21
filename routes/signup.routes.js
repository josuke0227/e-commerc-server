const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/signup.controllers");
const { googleSignup } = require("../controllers/signup.controllers");

router.post("/", signup);
router.post("/googleaccount", googleSignup);

module.exports = router;
