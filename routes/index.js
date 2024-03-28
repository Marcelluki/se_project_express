const router = require("express").Router();
const { NOT_FOUND_ERROR } = require("../utils/errors");
const clothingItemRouter = require("./clothingItem");
const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: "Route not Found" });
});
module.exports = router;
