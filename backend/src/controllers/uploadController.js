const uploadProductImages = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      message: "No images uploaded",
    });
  }

  const images = req.files.map((file) => {
    return `/uploads/products/${file.filename}`;
  });

  res.status(201).json({
    message: "Images uploaded successfully",
    images,
  });
};

module.exports = {
  uploadProductImages,
};