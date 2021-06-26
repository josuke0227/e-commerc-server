const cloudinary = require("cloudinary");
const Image = require("../models/image");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_COUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.upload = async (req, res) => {
  const { imageUri, productId, postedBy } = req.body;

  try {
    const result = await cloudinary.uploader.upload(imageUri, {
      public_id: `${Date.now()}`,
      resource_type: "auto",
    });

    const imageData = {
      public_id: result.public_id,
      url: result.url,
      productId,
      postedBy,
    };

    const image = new Image(imageData).save();

    res.status(200).send(image);
  } catch (error) {
    res;
    console.log("cloudinary image uploading error", error);
  }
};

exports.remove = async (req, res) => {
  const { public_id } = req.params;

  try {
    const image = await Image.find({ public_id });
    if (!image.length) {
      return res.status(400).send("Image does not exist.");
    }

    cloudinary.uploader.destroy(public_id, async (result) => {
      if (result.result === "ok") {
        await Image.deleteOne({ public_id });
        return res.status(200).send("Image deleted successfully.");
      }

      return res.status(400).send(result);
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.images = async (req, res) => {
  const { productId } = req.params;
  const images = await Image.find({ productId });
  if (!images.length) {
    return res.status(200).send([
      {
        url: "https://res.cloudinary.com/ymotoe-commerce/image/upload/v1623311194/h1hrgytgfzwikeln2rng.jpg",
      },
    ]);
  } else return res.status(200).send(images);
};
