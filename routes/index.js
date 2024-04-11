const router = require("express").Router();
const { login, createUser } = require("../controllers/users");
const { NOT_FOUND_ERROR } = require("../utils/errors");
const clothingItemRouter = require("./clothingItem");
const userRouter = require("./users");
const authorizationMiddleware = require("../middlewares/auth");

router.use("/users", authorizationMiddleware, userRouter);
router.use("/items", authorizationMiddleware, clothingItemRouter);
router.post("/signin", login);
router.post("/signup", createUser);
router.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: "Route not Found" });
});

module.exports = router;
