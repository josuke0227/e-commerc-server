const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const signup = require("../routes/signup.routes");

module.exports = (app) => {
  app.use(morgan("dev"));
  app.use(bodyParser.json());
  process.env.NODE_ENV === "development" &&
    app.use(cors({ origin: `http://localhost:3001` }));
  app.use("/api/signup", signup);
};
