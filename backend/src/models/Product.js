const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    trim: true,
  },

  sizeSlot: {
    type: Number,
    enum: [1, 2],
    default: 1,
  },

  color: {
    type: String,
    required: true,
    trim: true,
  },

  colorHex: {
    type: String,
    trim: true,
    default: "",
  },

  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },

  sku: {
    type: String,
    required: true,
    trim: true,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    images: {
      type: [String],
      default: [],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    variants: {
      type: [variantSchema],
      default: [],
    },

    saleType: {
      type: String,
      enum: ["series", "selective"],
      default: "selective",
    },

    availabilityStatus: {
      type: String,
      enum: ["in_stock", "out_of_stock", "limited"],
      default: "in_stock",
    },

    minimumOrderQuantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);