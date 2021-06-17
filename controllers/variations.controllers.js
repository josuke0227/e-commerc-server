const Variation = require("../models/variation");
const slugify = require("slugify");

exports.create = async (req, res) => {
  const { name, instances } = req.body;
  const slug = slugify(name);
  try {
    const existingData = await Variation.find({ slug });
    console.log(`existingData`, existingData);
    if (existingData.length > 0) {
      return res.status(400).send("Variation already exists.");
    }

    const newVariation = await new Variation({ name, instances, slug }).save();
    res.status(200).send(newVariation);
  } catch (error) {
    console.log("Variation create error", error);
    return res.status(400).send(error);
  }
};

exports.read = async (req, res) => {
  try {
    const variations = await Variation.find();
    res.status(200).send(variations);
  } catch (error) {
    console.log("Variation read error", error);
    return res.status(400).send(error);
  }
};

exports.update = async (req, res) => {
  const { slug } = req.params;
  const { name, instances } = req.body;

  try {
    const updatedVariation = await Variation.findOneAndUpdate(
      { slug },
      { name, slug: slugify(name), instances },
      { new: true }
    );
    res.status(200).send(updatedVariation);
  } catch (error) {
    console.log("Variation update error", error);
    return res.status(400).send(error);
  }
};

exports.remove = async (req, res) => {
  const { slug } = req.params;
  try {
    const removedVariation = await Variation.findOneAndDelete({ slug });
    res.status(200).send(removedVariation);
  } catch (error) {
    console.log("Variation delete error", error);
    return res.status(400).send(error);
  }
};
