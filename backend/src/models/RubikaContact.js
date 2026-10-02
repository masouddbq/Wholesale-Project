const mongoose = require("mongoose");

const rubikaContactSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
      index: true,
    },
    lastOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RubikaContact", rubikaContactSchema);
