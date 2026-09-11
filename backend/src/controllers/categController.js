const Category = require("../models/Category");

// POST /api/categories
const createCategory = async (req, res) => {
  const {
    name,
    slug,
    description,
    image,
    isActive,
  } = req.body;

  const category = await Category.create({
    name,
    slug,
    description,
    image,
    isActive,
  });

  res.status(201).json({
    message: "Category created successfully",
    category,
  });
};

// GET /api/categories
const getCategories = async (req, res) => {
  const categories = await Category.find()
    .sort({ createdAt: -1 });

  res.status(200).json({
    count: categories.length,
    categories,
  });
};

// GET /api/categories/:slug
const getCategoryBySlug = async (req, res) => {
  const category = await Category.findOne({
    slug: req.params.slug,
    isActive: true,
  });

  if (!category) {
    return res.status(404).json({
      message: "Category not found",
    });
  }

  res.status(200).json({
    category,
  });
};

// PATCH /api/categories/:id
const updateCategory = async (req, res) => {
  const category = await Category.findById(
    req.params.id
  );

  if (!category) {
    return res.status(404).json({
      message: "Category not found",
    });
  }

  const {
    name,
    slug,
    description,
    image,
    isActive,
  } = req.body;

  if (name !== undefined) category.name = name;
  if (slug !== undefined) category.slug = slug;
  if (description !== undefined)
    category.description = description;
  if (image !== undefined) category.image = image;
  if (isActive !== undefined)
    category.isActive = isActive;

  await category.save();

  res.status(200).json({
    message: "Category updated successfully",
    category,
  });
};

// DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  const category = await Category.findById(
    req.params.id
  );

  if (!category) {
    return res.status(404).json({
      message: "Category not found",
    });
  }

  await category.deleteOne();

  res.status(200).json({
    message: "Category deleted successfully",
  });
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
};