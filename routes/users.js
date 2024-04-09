const router = require("express").Router();
const {
  getUsers,
  createUser,
  getUser,
  getCurrentUser,
  updateUserProfile,
} = require("../controllers/users");

// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser);
router.get("/users/me", getCurrentUser);
router.patch("/users/me", updateUserProfile);
module.exports = router;
