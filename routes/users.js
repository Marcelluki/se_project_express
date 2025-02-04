const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { getCurrentUser, updateUserProfile } = require("../controllers/users");
const authorizationMiddleware = require("../middlewares/auth");

const validateUserProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30), // Adjust as needed
    avatar: Joi.string().uri().required(), // Ensure avatar is a valid URL
  }),
});

router.get("/me", authorizationMiddleware, getCurrentUser);
router.patch("/me", validateUserProfile, updateUserProfile);
module.exports = router;
