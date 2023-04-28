const express = require("express");
const router = express.Router();

const {
  getProducts,
  newProduct,
  getoneProduct,
  updateProdcut,
  deleteProduct,
} = require("../controllers/productController");
router.route("/products").get(getProducts);
router.route("/products/:id").get(getoneProduct);
router.route("/admin/products/:id").put(updateProdcut);
router.route("/admin/products/:id").delete(deleteProduct);
router.route("/products/new").post(newProduct);
module.exports = router;
