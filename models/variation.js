const mongoose = require("mongoose");

const variationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minLength: 1,
      maxLength: 50,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    instances: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Variation", variationSchema);
