const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  CONFLICT_ERROR,
  UNAUTHORIZED,
  FORBIDDEN_ERROR,
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

  if (!email) {
    return res.status(BAD_REQUEST_ERROR).send({ message: "Email is required" });
  }

  User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      return res
        .status(CONFLICT_ERROR)
        .send({ message: "A user with this email already exists" });
    }
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error(err);
        return res
          .status(UNAUTHORIZED)
          .send({ message: "Invalid Credentials" });
      }
      User.create({ name, avatar, email, password: hashedPassword })
        .then((user) => {
          if (user) {
            res.status(201).send({ name, avatar, email });
          }
        })
        // .catch((err) => {
        //   console.error(err);
        //   if (err.name === 11000) {
        //     return res
        //       .status(CONFLICT_ERROR)
        //       .send({ message: "User with this email already exists" });
        //   }
        .catch((err) => {
          console.error(err);
          if (err.code === 11000) {
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

      return res.status(200).send({ message: "User Found" });
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

// const getCurrentUser = (req, res) => {
//   const userData = req.user._id;

//   res.status(200).json(userData);
// };
const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  // Find user by ID
  User.findById(userId)
    .then((userId) => {
      if (!userId) {
        return res.status(404).send({ message: "User not found" });
      }
      console.log(userId);
      // User found, send response with user data
      return res.status(200).send({ userId });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Internal server error" });
    });
};

// login

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(BAD_REQUEST_ERROR).send({ message: "Email is required" });
  }
  if (!password) {
    return res
      .status(BAD_REQUEST_ERROR)
      .send({ message: "Password is required" });
  }
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
      console.log(err);
      if (err.message === "Incorrect email or password") {
        return res.status(UNAUTHORIZED).send({ message: err.message });
      }
      if (err.code === 11000) {
        return res.status(CONFLICT_ERROR).send({ message: "" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};
// Update User Profile

const updateUserProfile = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user._id.toString() !== req.user._id) {
        const error = FORBIDDEN_ERROR;
        error.status = 403;
        throw error;
      }
    })
    .then(() => {
      res.status(200).send({ name, avatar });
    })
    .catch((err) => {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).send({ error: "Server error" });
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
