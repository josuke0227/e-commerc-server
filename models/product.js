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
      maxlength: 2000,
      text: true,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: "Category",
    },
    subs: {
      type: ObjectId,
      ref: "SubCategory",
    },
    quantity: Number,
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    color: {
      type: String,
      enum: [
        "white",
        "black",
        "gray",
        "brown",
        "baige",
        "green",
        "blue",
        "purple",
        "yellow",
        "pink",
        "red",
        "orange",
        "silver",
        "gold",
      ],
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
