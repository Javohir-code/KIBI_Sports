const express = require("express");
const auth = require("../middleware/auth-user");
const router = express.Router();
const {
  registerUser,
  loginUser,
  deleteUser,
  updateUser,
  verifyUser,
} = require("../controllers/users");

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/delete/:id").delete(auth, deleteUser);
router.route("/update/:id").put(auth, updateUser);
router.route("/verify").get(verifyUser);

module.exports = router;
