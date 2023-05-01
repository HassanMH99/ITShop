const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apifeatures");

//Create New Produt => /api/v1/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {

  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

//get all products //api/v1/products
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 4;
  const productCount = await Product.countDocuments();
  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);

  const products = await apiFeatures.query;
  res.status(200).json({
    success: true,
    count: products.length,
    productCount,
    products,
  });
});

//Get one Product => /api/v1/product/:id
exports.getoneProduct = catchAsyncErrors(async (req, res, next) => {
  debugger
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

//update Product => /api/v1/product/:id
exports.updateProdcut = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      massage: "Product not found ",
    });
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

//Delete Product => /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      massage: "Product not found ",
    });
  }
  await product.deleteOne();
  res.status(200).json({
    success: true,
    massage: "Product is Deleted",
  });
});
