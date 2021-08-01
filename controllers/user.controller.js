const User = require("../models/user");
const Joi = require("joi");

const mockData = {
  address1: "35",
  address2: "Teralba Road",
  city: "Brighton Le Sands",
  country: "Afghanistan",
  isDefault: true,
  name: "Yosuke Motosugi",
  phone: "9064821338",
  postcode: "2216",
  state: "NSW",
};

const schema = Joi.object({
  address1: Joi.string().min(1).max(255),
  address2: Joi.string().min(1).max(255),
  city: Joi.string().min(1).max(255),
  country: Joi.string().min(1).max(255),
  isDefault: Boolean,
  name: Joi.string().min(1).max(255),
  phone: Joi.string()
    .pattern(/^([0-9])\w+$/)
    .min(1)
    .max(255),
  postcode: Joi.string()
    .pattern(/^([0-9])\w+$/)
    .min(1)
    .max(255),
  state: Joi.string().min(1).max(255),
});

// TODO: need to identify user by JWT
exports.update = async (req, res) => {
  const { address } = req.body;
  const result = schema.validate(address, { abortEarly: false });
  console.log(result);

  // try {
  //   await User.findOneAndUpdate(
  //     {
  //       _id: req.params.id,
  //     },
  //     { address: mockData }
  //   );
  // } catch (error) {
  //   console.log("error occurred at updating user function.", error);
  // }
};
