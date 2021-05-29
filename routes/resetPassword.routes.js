const express = require("express");
const { resetPassword } = require("../controllers/resetPassword.controllers");
const router = express.Router();

router.put("/", resetPassword);

module.exports = router;
