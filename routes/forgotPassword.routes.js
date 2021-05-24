const express = require("express");
const router = express.Router();
const { forgotPassword } = require("../controllers/forgotPassword.controllers");

router.put("/", forgotPassword);

module.exports = router;
