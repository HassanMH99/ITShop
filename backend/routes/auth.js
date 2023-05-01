const express = require("express");
const router = express.Router();

const {
  Register,
  Login,
  Logout,
  forgetPassword,
  ResetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
  getAllUsers,
  getUser,
  updateProfileByAdmin,
  DeleteUserByAdmin,
} = require("../controllers/authController");
const { isAuthUser, AuthRoles } = require("../middlewares/auth");
router.route("/register").post(Register);

router.route("/login").post(Login);
router.route("/logout").get(Logout);
router.route("/password/forget").post(forgetPassword);
router.route("/password/reset/:token").put(ResetPassword);
router.route("/password/update").put(isAuthUser, updatePassword);
router.route("/me").get(isAuthUser, getUserProfile);
router.route("/me/update").put(isAuthUser, updateProfile);
router.route("/admin/users").get(isAuthUser, AuthRoles("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthUser, AuthRoles("admin"), getUser)
  .put(isAuthUser, AuthRoles("admin"), updateProfileByAdmin)
  .delete(isAuthUser, AuthRoles("admin"), DeleteUserByAdmin);
module.exports = router;
