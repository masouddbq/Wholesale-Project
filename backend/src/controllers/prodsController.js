const Product = require("../models/Product");
const Category = require("../models/Category");
const mongoose = require("mongoose");

// POST /api/products
const createProduct = async (req, res) => {
  const {
    name,
    slug,
    description,
    price,
    images,
    category,
    variants,
    minimumOrderQuantity,
    isActive,
  } = req.body;

  const categoryExists = await Category.findOne({
    _id: category,
    isActive: true,
  });

  if (!categoryExists) {
    return res.status(404).json({
      message: "Category not found",
    });
  }

  const product = await Product.create({
    name,
    slug,
    description,
    price,
    images,
    category,
    variants,
    minimumOrderQuantity,
    isActive,
  });

  const populatedProduct = await product.populate(
    "category",
    "name slug"
  );

  res.status(201).json({
    message: "Product created successfully",
    product: populatedProduct,
  });
};

// GET /api/products
const getProducts = async (req, res) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    sort = "newest",
    page = 1,
    limit = 20,
  } = req.query;

  const currentPage = Math.max(Number(page), 1);

  const perPage = Math.min(
    Math.max(Number(limit), 1),
    100
  );

  const skip = (currentPage - 1) * perPage;

  const filter = {
    isActive: true,
  };

 if (search && search.trim()) {
  const searchRegex = new RegExp(
    search.trim(),
    "i"
  );

  filter.$or = [
    { name: searchRegex },
    { "variants.sku": searchRegex },
  ];
}

  if (category) {
    const categoryDoc = await Category.findOne({
      slug: category,
      isActive: true,
    });

    if (!categoryDoc) {
      return res.status(200).json({
        products: [],
        pagination: {
          page: currentPage,
          limit: perPage,
          total: 0,
          totalPages: 0,
        },
      });
    }

    filter.category = categoryDoc._id;
  }

  if (minPrice !== undefined) {
    const min = Number(minPrice);

    if (Number.isNaN(min) || min < 0) {
      return res.status(400).json({
        message: "Invalid minPrice",
      });
    }

    filter.price = {
      ...filter.price,
      $gte: min,
    };
  }

  if (maxPrice !== undefined) {
    const max = Number(maxPrice);

    if (Number.isNaN(max) || max < 0) {
      return res.status(400).json({
        message: "Invalid maxPrice",
      });
    }

    filter.price = {
      ...filter.price,
      $lte: max,
    };
  }

  const sortOptions = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    name_asc: { name: 1 },
    name_desc: { name: -1 },
  };

  const selectedSort =
    sortOptions[sort] || sortOptions.newest;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(selectedSort)
      .skip(skip)
      .limit(perPage),

    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(
    total / perPage
  );

  res.status(200).json({
    products,
    pagination: {
      page: currentPage,
      limit: perPage,
      total,
      totalPages,
    },
  });
};

// GET /api/products/:slug
const getProductBySlug = async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
    isActive: true,
  }).populate("category", "name slug");

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.status(200).json({
    product,
  });
};

// PATCH /api/products/:id
const updateProduct = async (req, res) => {
  const product = await Product.findById(
    req.params.id
  );

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const {
    name,
    slug,
    description,
    price,
    images,
    category,
    variants,
    minimumOrderQuantity,
    isActive,
  } = req.body;

  if (category !== undefined) {
    const categoryExists = await Category.findOne({
      _id: category,
      isActive: true,
    });

    if (!categoryExists) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    product.category = category;
  }

  if (name !== undefined) product.name = name;
  if (slug !== undefined) product.slug = slug;
  if (description !== undefined)
    product.description = description;
  if (price !== undefined) product.price = price;
  if (images !== undefined) product.images = images;
  if (variants !== undefined)
    product.variants = variants;
  if (minimumOrderQuantity !== undefined)
    product.minimumOrderQuantity =
      minimumOrderQuantity;
  if (isActive !== undefined)
    product.isActive = isActive;

  await product.save();

  const populatedProduct = await product.populate(
    "category",
    "name slug"
  );

  res.status(200).json({
    message: "Product updated successfully",
    product: populatedProduct,
  });
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  const product = await Product.findById(
    req.params.id
  );

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  await product.deleteOne();

  res.status(200).json({
    message: "Product deleted successfully",
  });
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      message: "Invalid product id",
    });
  }

  const product = await Product.findById(id).populate(
    "category",
    "name slug"
  );

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.status(200).json({
    product,
  });
};

const getAdminProducts = async (req, res) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    sort = "newest",
    page = 1,
    limit = 20,
  } = req.query;

  const currentPage = Math.max(Number(page), 1);

  const perPage = Math.min(
    Math.max(Number(limit), 1),
    100
  );

  const skip = (currentPage - 1) * perPage;

  // نکته مهم:
  // اینجا isActive نداریم
  // چون ادمین باید محصولات فعال و غیرفعال را ببیند.
  const filter = {};

  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

  if (category) {
    const categoryDoc = await Category.findOne({
      slug: category,
    });

    if (!categoryDoc) {
      return res.status(200).json({
        products: [],
        pagination: {
          page: currentPage,
          limit: perPage,
          total: 0,
          totalPages: 0,
        },
      });
    }

    filter.category = categoryDoc._id;
  }

  if (minPrice !== undefined) {
    const min = Number(minPrice);

    if (Number.isNaN(min) || min < 0) {
      return res.status(400).json({
        message: "Invalid minPrice",
      });
    }

    filter.price = {
      ...filter.price,
      $gte: min,
    };
  }

  if (maxPrice !== undefined) {
    const max = Number(maxPrice);

    if (Number.isNaN(max) || max < 0) {
      return res.status(400).json({
        message: "Invalid maxPrice",
      });
    }

    filter.price = {
      ...filter.price,
      $lte: max,
    };
  }

  const sortOptions = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    name_asc: { name: 1 },
    name_desc: { name: -1 },
  };

  const selectedSort =
    sortOptions[sort] ||
    sortOptions.newest;

  const [products, total] =
    await Promise.all([
      Product.find(filter)
        .populate(
          "category",
          "name slug"
        )
        .sort(selectedSort)
        .skip(skip)
        .limit(perPage),

      Product.countDocuments(filter),
    ]);

  const totalPages = Math.ceil(
    total / perPage
  );

  res.status(200).json({
    products,
    pagination: {
      page: currentPage,
      limit: perPage,
      total,
      totalPages,
    },
  });
};

module.exports = {
  createProduct,
  getProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  getProductById,
  getAdminProducts,
};