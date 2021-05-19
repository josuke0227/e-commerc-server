const express = require("express");
require("dotenv").config();

const app = express();
require("./startup/db")();
require("./startup/routes")(app);

const port = process.env.PORT || 1234;
app.listen(port, () => {
  console.log(`Listening to port ${port}...`);
});
