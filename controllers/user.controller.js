const User = require("../models/user");

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

exports.getAddress = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).send(user.address);
  } catch (error) {
    console.log("error occurred at updating user function.", error);
  }
};
