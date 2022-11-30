const Products = require("../models/Products");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

// @desc Get all products
// @route GET /products
// @access Private
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Products.find().exec();
  if (!products.length) {
    return res.status(400).json({ message: "No products found" });
  }
  res.json(products);
});

// @desc Create a new product
// @route POST /products
// @access Private
const createProduct = asyncHandler(async (req, res) => {
  // Get data in request body
  const { name, size, unit, type, brand, price } = req.body;

  // validate data
  if (!name || !size || !unit || !type || !brand || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicates
  const duplicate = await Products.findOne({ name, size }).lean().exec();
  if (duplicate) {
    return res
      .status(400)
      .json({ message: `${name} with size ${size} already exists` });
  }

  const createProductItem = {
    name,
    size,
    unit,
    type,
    brand,
    price,
  };

  const productDoc = new Products(createProductItem);

  await productDoc.save();
});

// @desc Update a product
// @route PATCH /product
// @access Private
const updateProduct = asyncHandler(async (req, res) => {});

// @desc Delete a product
// @route DELETE /products
// @access Private
const deleteProduct = asyncHandler(async (req, res) => {});

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
