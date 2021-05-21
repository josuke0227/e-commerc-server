const express = require("express");
const router = express.Router();
const { signin } = require("../controllers/signin.controllers");

router.post("/", signin);

module.exports = router;
