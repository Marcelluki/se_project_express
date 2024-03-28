const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users");
const { NOT_FOUND_ERROR } = require("../utils/errors");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);
router.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: "Route not Found" });
});
module.exports = router;
