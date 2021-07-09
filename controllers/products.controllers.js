const Product = require("../models/product");
const Image = require("../models/image");
const slugify = require("slugify");

const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_COUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.create = async (req, res) => {
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
    .populate("subCategory")
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
  const productId = req.body.id;

  try {
    const product = await Product.findById(productId);
    if (product === null) {
      return res.status(400).send("Product not found.");
    }

    const images = await Image.find({ productId });
    if (images.length) {
      for (let i of images) {
        cloudinary.uploader.destroy(i.public_id, (result) => {
          console.log(`result`, result);
          if (result.result !== "ok") {
            return res.status(400).send(result);
          }
        });
      }
      await Image.deleteOne({ productId });
    }

    const removedProduct = await Product.findOneAndDelete({
      slug: req.params.slug,
    });
    return res.status(200).send(removedProduct);
  } catch (error) {
    console.log("error occurred at delete function", error);
    return res.status(400).send("Product delete failed.");
  }
};
