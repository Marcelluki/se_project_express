const router = require("express").Router();

const clothingItemRouter = require("./clothingItem");
const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
module.exports = router;
