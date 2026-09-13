const SiteContent = require("../models/siteContents");

const getContentBySlug = async (req, res) => {
  const content = await SiteContent.findOne({
    slug: req.params.slug,
    isActive: true,
  });

  if (!content) {
    return res.status(404).json({
      message: "Content not found",
    });
  }

  res.status(200).json({
    content,
  });
};

const getAllContents = async (req, res) => {
  const contents = await SiteContent.find().sort({
    createdAt: -1,
  });

  res.status(200).json({
    count: contents.length,
    contents,
  });
};

const createContent = async (req, res) => {
  const {
    title,
    slug,
    content,
    isActive,
  } = req.body;

  const newContent = await SiteContent.create({
    title,
    slug,
    content,
    isActive,
  });

  res.status(201).json({
    message: "Content created successfully",
    content: newContent,
  });
};

const updateContent = async (req, res) => {
  const content = await SiteContent.findById(
    req.params.id
  );

  if (!content) {
    return res.status(404).json({
      message: "Content not found",
    });
  }

  const {
    title,
    slug,
    content: contentText,
    isActive,
  } = req.body;

  if (title !== undefined) {
    content.title = title;
  }

  if (slug !== undefined) {
    content.slug = slug;
  }

  if (contentText !== undefined) {
    content.content = contentText;
  }

  if (isActive !== undefined) {
    content.isActive = isActive;
  }

  await content.save();

  res.status(200).json({
    message: "Content updated successfully",
    content,
  });
};

const deleteContent = async (req, res) => {
  const content = await SiteContent.findById(
    req.params.id
  );

  if (!content) {
    return res.status(404).json({
      message: "Content not found",
    });
  }

  await content.deleteOne();

  res.status(200).json({
    message: "Content deleted successfully",
  });
};

module.exports = {
  getContentBySlug,
  getAllContents,
  createContent,
  updateContent,
  deleteContent,
};