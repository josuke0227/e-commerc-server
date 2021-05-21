const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const signup = require("../routes/signup.routes");
const accountActivation = require("../routes/accountActivation.routes");
const signin = require("../routes/signin.routes");

const { NODE_ENV, CLIENT_URL } = process.env;

module.exports = (app) => {
  app.use(morgan("dev"));
  app.use(bodyParser.json());
  NODE_ENV === "development" && app.use(cors({ origin: CLIENT_URL }));
  app.use("/api/signup", signup);
  app.use("/api/signin", signin);
  app.use("/api/accountactivation", accountActivation);
};
