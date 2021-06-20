const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      text: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxLength: 2000,
      text: true,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
      maxLength: 32,
    },
    category: {
      type: ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: ObjectId,
      ref: "SubCategory",
    },
    variations: {
      type: [Object],
    },
    quantity: Number,
    sold: {
      type: Number,
      default: 0,
    },
    brand: {
      type: String,
    },
    ratings: [
      {
        start: Number,
        postedBy: { type: ObjectId, ref: "User" },
      },
    ],
  },
  {
    timestams: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
