const router = require("express").Router();
const { login, createUser } = require("../controllers/users");
// const { NOT_FOUND_ERROR, NotFoundError } = require("../utils/errors");
const NotFoundError = require("../errors/NotFoundError");
const clothingItemRouter = require("./clothingItem");
const userRouter = require("./users");
const authorizationMiddleware = require("../middlewares/auth");
const { validateLogin, validateUser } = require("../middlewares/validation");

router.use("/users", authorizationMiddleware, userRouter);
router.use("/items", clothingItemRouter);
router.post("/signin", validateLogin, login);
router.post("/signup", validateUser, createUser);
router.use((req, res, next) => {
  // res.status(NOT_FOUND_ERROR).send({ message: "Route not Found" });
  next(new NotFoundError("Route Not Found"));
});

module.exports = router;
