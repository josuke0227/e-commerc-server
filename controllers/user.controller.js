const User = require("../models/user");

exports.registerAddress = async (req, res) => {
  const [address] = req.body;

  try {
    await User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { $push: { address } }
    );
    res.status(200).send();
  } catch (error) {
    console.log("error occurred at updating user function.", error);
  }
};

exports.changeDefaultAddress = async (req, res) => {
  try {
    await User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { address: req.body }
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
