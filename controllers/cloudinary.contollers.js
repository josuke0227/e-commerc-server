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
      resoure_type: "auto",
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
  const image_id = req.body.public_id;

  cloudinary.uploader.destroy(image_id, ({ result }) => {
    if (result === "ok") {
      return res.status(200).send("Image deleted successfully.");
    }

    return res.status(400).send(result);
  });
};

exports.images = async (req, res) => {
  const { productId } = req.params;
  const images = await Image.find({ productId });
  if (images === null) {
    res.status(200).send([
      {
        url: "https://res.cloudinary.com/ymotoe-commerce/image/upload/v1623311194/h1hrgytgfzwikeln2rng.jpg",
      },
    ]);
    return;
  } else return res.status(200).send(images);
};
