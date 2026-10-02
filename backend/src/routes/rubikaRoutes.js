const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const { handleRubikaWebhook } = require("../controllers/rubikaController");

const router = express.Router();

router.post("/webhook", asyncHandler(handleRubikaWebhook));
router.get("/webhook", (req, res) => {
  res.json({
    ok: true,
    configured: Boolean(
      (process.env.RUBIKA_BOT_TOKEN || "").trim()
    ),
  });
});

module.exports = router;
