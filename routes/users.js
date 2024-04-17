const router = require("express").Router();
const { getCurrentUser, updateUserProfile } = require("../controllers/users");
const authorizationMiddleware = require("../middlewares/auth");

router.get("/me", authorizationMiddleware, getCurrentUser);
router.patch("/me", updateUserProfile);
module.exports = router;
