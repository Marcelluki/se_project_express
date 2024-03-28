const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users");
const { NOT_FOUND_ERROR } = require("../utils/errors");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);
module.exports = router;
