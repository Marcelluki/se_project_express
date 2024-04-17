const router = require("express").Router();
const {
  getUsers,
  createUser,
  getUser,
  getCurrentUser,
  updateUserProfile,
} = require("../controllers/users");
const authorizationMiddleware = require("../middlewares/auth");

// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser);
router.get("/me", authorizationMiddleware, getCurrentUser);
router.patch("/me", updateUserProfile);
module.exports = router;
