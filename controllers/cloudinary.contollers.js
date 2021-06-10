const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_COUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.upload = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: `${Date.now()}`,
      resoure_type: "auto",
    });
    res.json({
      public_id: result.public_id,
      url: result.secure_url,
    });
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
