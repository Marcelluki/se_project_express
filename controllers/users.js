const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

// const {
// INTERNAL_SERVER_ERROR,
// BAD_REQUEST_ERROR,
// NOT_FOUND_ERROR,
// CONFLICT_ERROR,
// UNAUTHORIZED,
//   ConflictError,
//   BadRequestError,
//   NotFoundError,
//   UnauthorizedError,
// } = require("../utils/errors");
const ConflictError = require("../errors/ConflictError");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");

// Create User

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    // return res.status(BAD_REQUEST_ERROR).send({ message: "Email is required" });
    next(new BadRequestError("Email is required"));
  }

  return User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      // return res
      //   .status(CONFLICT_ERROR)
      //   .send({ message: "A user with this email already exists" });
      return next(new ConflictError("A user with this email already exists"));
    }

    return bcrypt
      .hash(password, 10)
      .then((hashedPassword) =>
        User.create({ name, avatar, email, password: hashedPassword }),
      )
      .then(() => res.status(201).send({ name, avatar, email }))
      .catch((err) => {
        console.error(err);
        if (err.code === 11000) {
          // return res
          //   .status(CONFLICT_ERROR)
          //   .send({ message: "User with this email already exists" });
          next(new ConflictError("User with this email already exists"));
        }
        if (err.name === "ValidationError") {
          // return res
          //   .status(BAD_REQUEST_ERROR)
          //   .send({ message: "Invalid data" });
          next(new BadRequestError("Invalid data"));
        } else {
          next(err);
        }
        // return res
        //   .status(INTERNAL_SERVER_ERROR)
        //   .send({ message: "An error has occurred on the server." });
      });
  });
};

// GET User by ID
// Get Current User
const getCurrentUser = (req, res, next) => {
  // Find user by ID
  User.findById(req.user._id)
    .then((userId) => {
      if (!userId) {
        // return res.status(NOT_FOUND_ERROR).send({ message: "User not found" });
        next(new NotFoundError("User not found"));
      }
      return res.status(200).send({ userId });
    })
    .catch((err) => {
      console.log(err);
      next(err);
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "Internal server error" });
    });
};

// login

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    // return res.status(BAD_REQUEST_ERROR).send({ message: "Email is required" });
    next(new BadRequestError("Email is required"));
  }
  if (!password) {
    // return res
    //   .status(BAD_REQUEST_ERROR)
    //   .send({ message: "Password is required" });
    next(new BadRequestError("Password is required"));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        // return res
        //   .status(UNAUTHORIZED)
        //   .send({ message: "Invalid email or password" });
        next(new UnauthorizedError("Invalid email or password"));
      }

      // Create JWT token
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      // Send token in response
      return res.status(200).send({
        token,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      console.log(err);
      if (err.message === "Incorrect email or password") {
        // return res.status(UNAUTHORIZED).send({ message: err.message });
        next(new UnauthorizedError("Incorrect email or password"));
      } else {
        next(err);
      }

      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server" });
    });
};
// Update User Profile

const updateUserProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    // .then((user) => {
    //   if (user._id.toString() !== req.user._id) {
    //     const error = FORBIDDEN_ERROR;
    //     error.status = 403;
    //     throw error;
    //   }
    // })
    .then(() => {
      res.status(200).send({ name, avatar });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        // return res
        //   .status(BAD_REQUEST_ERROR)
        //   .send({ message: "Cannot update this user" });
        next(new BadRequestError("Cannot update this user"));
      } else {
        next(err);
      }
      // return res.status(INTERNAL_SERVER_ERROR).send({ error: "Server error" });
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUserProfile,
};
