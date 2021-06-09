const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const signup = require("../routes/signup.routes");
const accountActivation = require("../routes/accountActivation.routes");
const signin = require("../routes/signin.routes");
const forgotPassword = require("../routes/forgotPassword.routes");
const resetPassword = require("../routes/resetPassword.routes");
const categories = require("../routes/categories.routes");
const subCategories = require("../routes/subCategories.routes");
const products = require("../routes/products.routes");

const { NODE_ENV, CLIENT_URL } = process.env;

module.exports = (app) => {
  app.use(morgan("dev"));
  app.use(bodyParser.json());
  NODE_ENV === "development" &&
    app.use(
      cors({
        origin: CLIENT_URL,
        exposedHeaders: ["x-auth-token"],
      })
    );
  app.use("/api/signup", signup);
  app.use("/api/signin", signin);
  app.use("/api/accountactivation", accountActivation);
  app.use("/api/forgotpassword", forgotPassword);
  app.use("/api/resetPassword", resetPassword);
  app.use("/api/categories", categories);
  app.use("/api/subcategories", subCategories);
  app.use("/api/products", products);
};
