const Product = require("../models/product");
const slugify = require("slugify");
const { rawListeners } = require("../models/product");

exports.create = async (req, res) => {
  console.log(req.body);

  try {
    req.body.slug = slugify(req.body.title);
    console.log(`req.body.slug`, req.body.slug);

    const product = await Product.findOne({ slug: req.body.slug });
    console.log(`product`, product);
    if (product) {
      return res.status(400).send("Product already exists.");
    }

    const newProduct = await new Product(req.body).save();
    res.status(200).json(newProduct);
  } catch (error) {
    console.log("Product create error", error);
    if (error.code === 11000)
      return res
        .status(400)
        .send("Cannot register same product of same name twice.");

    res.status(400).send("Invalid data.");
  }
};

exports.products = async (req, res) => {
  const products = await Product.find({})
    .limit(parseInt(req.params.cont))
    .populate("category")
    .populate("subs")
    .sort([["createdAt", "desc"]])
    .exec();
  res.json(products);
};
