const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Products", productsSchema);
