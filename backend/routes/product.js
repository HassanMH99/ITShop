const express = require("express");
const router = express.Router();

const {
  getProducts,
  newProduct,
  getoneProduct,
  updateProdcut,
  deleteProduct,
} = require("../controllers/productController");
const {isAuthUser,AuthRoles }= require('../middlewares/auth')
router.route("/products").get(getProducts);
router.route("/products/:id").get(getoneProduct);
router.route("/admin/products/:id").put(isAuthUser,AuthRoles('admin'),updateProdcut);
router.route("/admin/products/:id").delete(isAuthUser,AuthRoles('admin'),deleteProduct);
router.route("/products/new").post(isAuthUser,AuthRoles('admin'),newProduct);
module.exports = router;
