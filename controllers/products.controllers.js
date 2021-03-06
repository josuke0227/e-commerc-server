const Product = require("../models/product");
const User = require("../models/user");
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
    .populate("brand")
    .sort([["createdAt", "desc"]])
    .exec();
  res.status(200).send(products);
};

exports.product = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category")
    .populate("subCategory")
    .populate("brand")
    .exec();
  res.status(200).send(product);
};

exports.productsList = async (req, res) => {
  try {
    const {
      sort,
      order,
      page,
      itemsPerPage,
      query: clientData = [],
    } = req.body;
    const currentPage = page || 1;
    const query = createQuery(clientData);

    const products = await Product.find(
      clientData.length ? { $and: [...query] } : {}
    )
      .skip((currentPage - 1) * itemsPerPage)
      .populate("category")
      .populate("subCategory")
      .populate("brand")
      .sort([[sort, order]])
      .limit(itemsPerPage)
      .exec();

    const count = clientData.length
      ? await Product.find({ $and: [...query] })
          .countDocuments()
          .exec()
      : await Product.find({}).estimatedDocumentCount().exec();

    res.status(200).send({ products, count });
  } catch (error) {
    console.log("error occurred at productsList function.", error);
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

exports.rating = async (req, res) => {
  const { rate, user } = req.body;
  const updatingProduct = await Product.findById(req.params.productId);
  const postedBy = await User.findById(user.id);
  const data = { rate, postedBy: postedBy._id };
  const existingRatingData = findRating(updatingProduct, user.id);

  try {
    if (existingRatingData) {
      await Product.updateOne(
        {
          ratings: { $elemMatch: existingRatingData },
        },
        {
          $set: { "ratings.$.rate": rate },
        },
        { new: true }
      );
      res.status(200).send();
    } else {
      await Product.findByIdAndUpdate(
        updatingProduct._id,
        {
          $push: { ratings: { ...data } },
        },
        {
          new: true,
        }
      );
      res.status(200).send();
    }
  } catch (error) {
    res.status(400).json("Rating failed.");
  }
};

function createQuery(clientData) {
  let query = [];
  for (let i = 0; i < clientData.length; i++) {
    if (i % 2 === 0) {
      const name = clientData[i];
      const data = clientData[i + 1];
      if (name === "variations") {
        data.forEach((d) => query.push(createVariationsQuery(d)));
        continue;
      }

      if (name === "price") {
        query.push(createPriceQuery(data));
        continue;
      }

      if (name === "text") {
        query = [...query, { $text: { $search: data[0].value } }];
        continue;
      }

      if (data.length > 1) {
        query = [...query, { $or: data.map((d) => ({ [name]: d })) }];
        continue;
      }

      if (name === "ratings") {
        query.push(createRatingQuery(data));
        continue;
      }
      query.push({ [name]: data[0] });
    }
  }
  return query;
}

function createVariationsQuery(value) {
  const { name, data } = value;
  return {
    [`variations.${name}`]: { ...data },
  };
}

function createPriceQuery(data) {
  const min = data[0];
  const max = data[1];
  return {
    price: { $gte: min, $lte: max },
  };
}

function createRatingQuery(data) {
  const [{ value }] = data;
  return {
    "ratings.rate": { $gte: value },
  };
}

function findRating(product, userId) {
  let result;
  result = product.ratings.find(
    (r) => r.postedBy.toString() === userId.toString()
  );

  return result;
}
