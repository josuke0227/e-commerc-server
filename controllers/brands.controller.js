const Brand = require("../models/brand");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Brand({ name, slug: slugify(name) }).save();
    res.status(200).send(category);
  } catch (error) {
    console.log("Brand create error", error.code);
    if (error.code === 11000) {
      return res.status(400).send("Brand already exists.");
    }
    res.status(400).send("Create category failed");
  }
};

exports.getAll = async (req, res) =>
  res.json(await Brand.find({}).sort({ craeteAt: -1 }).exec());

// exports.read = async (req, res) => {
//   const category = await Brand.findOne({ slug: req.params.slug }).exec();
//   // res.json(category);
//   const products = await Product.find({ category })
//     .populate("category")
//     .populate("potedBy", "_id name")
//     .exec();

//   res.json({
//     category,
//     products,
//   });
// };

exports.update = async (req, res) => {
  try {
    const { name } = req.body;
    const updated = await Brand.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send(updated);
  } catch (error) {
    console.log("Brand update error", error);
    res.status(400).send("Brand Update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Brand.findOneAndDelete({ slug: req.params.slug });
    console.log(`deleted`, deleted);
    res.status(200).send(deleted);
  } catch (error) {
    console.log("Brand Remove error", error);
    res.status(400).send("Brand deletion failed");
  }
};
