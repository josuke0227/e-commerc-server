const User = require("../models/user");

// TODO: need to identify user by JWT
exports.update = async (req, res) => {
  try {
    await User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { $push: { address: req.body } }
    );
    res.status(200).send();
  } catch (error) {
    console.log("error occurred at updating user function.", error);
  }
};
