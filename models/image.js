const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const imageSchema = new mongoose.Schema(
  {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
    productId: { type: ObjectId, ref: "Product", required: true },
    postedBy: { type: ObjectId, ref: "User", required: true },
  },
  {
    timestams: true,
  }
);

module.exports = mongoose.model("Image", imageSchema);
