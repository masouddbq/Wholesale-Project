const SiteContent = require("../models/siteContents");

// GET /api/site-content
const getSiteContents = async (req, res) => {
  const contents = await SiteContent.find()
    .sort({
      key: 1,
    })
    .lean();

  res.status(200).json({
    contents,
  });
};

// GET /api/site-content/:key
const getSiteContent = async (req, res) => {
  const content = await SiteContent.findOne({
    key: req.params.key,
  }).lean();

  if (!content) {
    return res.status(404).json({
      message: "Site content not found",
    });
  }

  res.status(200).json({
    content,
  });
};

// PUT /api/site-content/:key
const upsertSiteContent = async (req, res) => {
  const key = req.params.key;

  const content = await SiteContent.findOneAndUpdate(
    { key },
    {
      key,
      data: req.body,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    message: "Site content updated successfully",
    content,
  });
};

module.exports = {
  getSiteContents,
  getSiteContent,
  upsertSiteContent,
};