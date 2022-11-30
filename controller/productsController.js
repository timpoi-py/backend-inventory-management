const Products = require("../models/Products");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const { deleteModel } = require("mongoose");

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
  const duplicate = await Products.findOne({ name, size, brand }).lean().exec();
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

  const product = await Products.create(createProductItem);

  if (product) {
    res
      .status(201)
      .json({ message: `Product ${name} with size ${size} is created` });
  } else {
    res.status(400).json({ message: "Invalid credentials" });
  }
});

// @desc Update a product
// @route PATCH /product
// @access Private
const updateProduct = asyncHandler(async (req, res) => {
  // Get data in request body
  const { id, name, size, unit, type, brand, price } = req.body;

  // validate data
  if (!id || !name || !size || !unit || !type || !brand || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // get product
  const product = await Products.findById(id).exec();
  if (!product) {
    res.status(400).json({ message: "Product not found" });
  }

  // check duplicate
  const duplicate = await Products.findOne({ name, brand, size }).lean().exec();
  if (duplicate && duplicate?._id.toString() !== id) {
    res.status(409).json({ message: "Error: Duplicate products" });
  }

  product.name = name;
  product.size = size;
  product.unit = unit;
  product.type = type;
  product.brand = brand;
  product.price = price;

  const updatedProduct = await product.save();

  res.json({ message: `${updatedProduct.name} has been updated` });
});

// @desc Delete a product
// @route DELETE /products
// @access Private
const deleteProduct = asyncHandler(async (req, res) => {
  // get id from the request body
  const { id } = req.body;
  if (!id) {
    res.status(400).json({ message: "Product ID is required" });
  }

  // Find the product by ID
  const product = await Products.findById(id).exec();
  if (!product) {
    res.status(400).json({ message: "Product not found" });
  }

  const deletedProduct = await product.deleteOne();

  res.json({
    message: `${deletedProduct.name} with brand ${deletedProduct.brand} and with a size of ${deletedProduct.size} ${deletedProduct.unit} has been deleted`,
  });
});

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
