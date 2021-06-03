const SubCategory = require("../models/SubCategory");
// const Product = require("../models/product");
// const Sub = require("../models/sub");
const slugify = require("slugify");
const Joi = require("joi");
Joi.ObjectId = require("joi-objectid")(Joi);

exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const subCategory = await new SubCategory({
      name,
      parent,
      slug: slugify(name),
    }).save();
    res.status(200).send(subCategory);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send("Sub category already exists.");
    }
    res.status(400).send("Create sub category failed");
  }
};

// TODO: when to use exec()
exports.getSubCategories = async (req, res) =>
  res.json(await SubCategory.find({}).sort({ craeteAt: -1 }).exec());

exports.pickByParentId = async (req, res) => {
  const { parentId } = req.params;
  const { error } = validateObjectId(parentId);

  if (error) return res.status(400).send("Invalid request");

  try {
    const subCategories = await SubCategory.find({ parent: parentId });
    res.status(200).send(subCategories);
  } catch (error) {
    console.log("sub category finding error", error);
    res.send(400).send("Could not find sub categories.");
  }
};
// exports.getOne = async (req, res) => {
//   const subCategory = await SubCategory.findOne({
//     slug: req.params.slug,
//   }).exec();
//   // res.json(category);
//   const products = await Product.find({ category })
//     .populate("category")
//     .populate("postedBy", "_id name")
//     .exec();

//   res.json({
//     category,
//     products,
//   });
// };

exports.update = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const updated = await SubCategory.findOneAndUpdate(
      { slug: req.params.slug },
      { name, parent, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send(updated);
  } catch (error) {
    console.log("Category update error", error);
    res.status(400).send("Category Update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await SubCategory.findOneAndDelete({
      slug: req.params.slug,
    });
    res.status(200).send(deleted);
  } catch (error) {
    console.log("Category Remove error", error);
    res.status(400).send("Category deletion failed");
  }
};

function validateObjectId(objectId) {
  const schema = Joi.ObjectId().label("Parent id");

  return schema.validate(objectId);
}
