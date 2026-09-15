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

const uploadCategoryImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No image uploaded",
    });
  }

  const image = `/uploads/categories/${req.file.filename}`;

  res.status(201).json({
    message: "Category image uploaded successfully",
    image,
  });
};

const uploadSiteContentImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "تصویری انتخاب نشده است.",
    });
  }

  const imageUrl = `/uploads/site-content/${req.file.filename}`;

  res.status(201).json({
    message: "تصویر با موفقیت آپلود شد.",
    image: imageUrl,
  });
};

module.exports = {
  uploadProductImages,
  uploadCategoryImage,
  uploadSiteContentImage,
};