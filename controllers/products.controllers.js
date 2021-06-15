const Product = require("../models/product");
const slugify = require("slugify");

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
    .populate("subCategory")
    .sort([["createdAt", "desc"]])
    .exec();
  res.status(200).send(products);
};

exports.product = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category")
    .populate("subCategori")
    .exec();
  res.status(200).send(product);
};

exports.productList = async (req, res) => {
  try {
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    const perPage = 3;

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subCategory")
      .sort([[sort, order]])
      .limit(perPage)
      .exec();

    res.status(200).send(products);
  } catch (error) {
    console.log("error occured at productList function.", error);
  }
};

exports.update = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec();

    res.status(200).json(updated);
  } catch (error) {
    console.log("error occured at update function.", error);
    res.status(400).send({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndRemove({
      slug: req.params.slug,
    }).exec();
    res.status(200).send(deleted);
  } catch (error) {
    console.log("error occured at delete function", error);
    res.status(400).send("Product delete failed.");
  }
};
