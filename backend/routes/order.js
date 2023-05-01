const express = require("express");
const router = express.Router();
const {
  newOrder,
  getSingleOrder,
  myOrders,
  allOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { isAuthUser, AuthRoles } = require("../middlewares/auth");

router.route("/order/new").post(isAuthUser, newOrder);
router.route("/order/:id").get(isAuthUser, getSingleOrder);
router.route("/orders/me").get(isAuthUser, myOrders);
router.route("/admin/orders").get(isAuthUser, AuthRoles("admin"), allOrders);
router
  .route("/admin/order/:id")
  .put(isAuthUser, AuthRoles("admin"), updateOrder)
  .delete(isAuthUser, AuthRoles("admin"), deleteOrder);
module.exports = router;
