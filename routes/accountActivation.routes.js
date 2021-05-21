const express = require("express");
const router = express.Router();
const {
  accountActivation,
} = require("../controllers/accountActivation.controller");

router.post("/", accountActivation);

module.exports = router;
