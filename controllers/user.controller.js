const User = require("../models/user");

exports.registerAddress = async (req, res) => {
  const [address] = req.body;
  const { isDefault } = address;
  const id = req.params.id;
  if (isDefault) {
    try {
      const { address: current } = await User.findById(id);
      const newAddress = current.map(({ _doc }) => ({
        ..._doc,
        isDefault: false,
      }));
      newAddress.push(address);
      req.body = newAddress;
      this.changeDefaultAddress(req, res);
    } catch (error) {
      console.log("error occurred at updating user function.", error);
    }
    return;
  }

  try {
    const { address: newAddress } = await User.findOneAndUpdate(
      {
        _id: id,
      },
      { $push: { address } },
      { new: true }
    );
    res.status(200).send(newAddress);
  } catch (error) {
    console.log("error occurred at updating user function.", error);
  }
};

const isEqualObjectId = (objectId, string) =>
  JSON.stringify(objectId) === `"${string}"`;

exports.deleteAddress = async (req, res) => {
  const [address] = req.body;
  const id = req.params.id;

  try {
    const { address: current } = await User.findById(id);
    const newAddress = current.filter(
      ({ _doc }) => !isEqualObjectId(_doc._id, address._id)
    );
    req.body = newAddress;
    this.changeDefaultAddress(req, res);
  } catch (error) {
    console.log("error occurred at delete user address function.", error);
  }
};

exports.updateAddress = async (req, res) => {
  const [address] = req.body;
  const { isDefault } = address;
  const id = req.params.id;
  if (isDefault) {
    try {
      const { address: current } = await User.findById(id);
      const newAddress = current.map(({ _doc }) =>
        isEqualObjectId(_doc._id, address._id)
          ? {
              ...address,
            }
          : {
              ..._doc,
              isDefault: false,
            }
      );
      req.body = newAddress;
      this.changeDefaultAddress(req, res);
    } catch (error) {
      console.log("error occurred at updating user function.", error);
    }
    return;
  }

  try {
    const { address: current } = await User.findById(id);
    const newAddress = current.map(({ _doc }) =>
      isEqualObjectId(_doc._id, address._id)
        ? {
            ...address,
          }
        : _doc
    );
    req.body = newAddress;
    this.changeDefaultAddress(req, res);
  } catch (error) {
    console.log("error occurred at updating user function.", error);
  }
};

exports.changeDefaultAddress = async (req, res) => {
  try {
    const { address } = await User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { address: req.body },
      { new: true }
    );
    res.status(200).send(address);
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
