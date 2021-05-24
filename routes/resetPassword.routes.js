const express = require("express");
const { resetPassword } = require("../controllers/resetPassword");
const router = express.Router();

router.put("/", resetPassword);

module.exports = router;
