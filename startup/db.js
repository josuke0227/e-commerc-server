const mongoose = require("mongoose");

module.exports = () => {
  mongoose
    .connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => console.log("DB connected"))
    .catch((err) => console.log("DB CONNECTION ERROR: ", err));
};
