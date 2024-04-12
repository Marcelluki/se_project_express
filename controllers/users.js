const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  CONFLICT_ERROR,
} = require("../utils/errors");

// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// Create User

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      return res
        .status(CONFLICT_ERROR)
        .send({ message: "User with this email already exists" });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error(err);
        return res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
      User.create({ name, avatar, email, password: hashedPassword })
        .then((user) => {
          res.status(201).send({ name, avatar, email });
        })
        .catch((err) => {
          console.error(err);
          if (err.name === 11000) {
            return res
              .status(CONFLICT_ERROR)
              .send({ message: "User with this email already exists" });
          }
          if (err.name === "ValidationError") {
            return res
              .status(BAD_REQUEST_ERROR)
              .send({ message: "Invalid data" });
          }
          return res
            .status(INTERNAL_SERVER_ERROR)
            .send({ message: "An error has occurred on the server." });
        });
    });
  });
};

// GET User by ID

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR).send({ message: "User not Found" });
      }

      return res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};
// Get Current User

const getCurrentUser = (req, res) => {
  const { userData } = req.user._id;

  res.status(200).send(userData);
};

// login

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: "Invalid email or password" });
      }

      // Create JWT token
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      // Send token in response
      res.status(200).send({ token });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .send({ message: "An error has occurred on the server" });
    });
};
// Update User Profile

const updateUserProfile = (req, res) => {
  const allowedFields = ["name", "avatar"];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every(
    (update) => allowedFields.includes(update),
    console.log(allowedFields),
  );

  if (!isValidOperation) {
    return res.status(400).json({ error: "Invalid updates!" });
  }

  updates.forEach((update) => {
    req.user[update] = req.body[update];
  });

  req.user
    .save()
    .then((user) => {
      res.status(200).json({ user });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ error: "Server error" });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  login,
  getCurrentUser,
  updateUserProfile,
};
