const ClothingItem = require("../models/clothingItem");
const {
  // INTERNAL_SERVER_ERROR,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");

// Create Clothing Item

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const userId = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner: userId })
    .then((item) => {
      console.log(item);
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        // return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
    });
};

// GET Clothing Items

const getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);

      next(err);
    });
};

// Like Clothing Item

const likeClothingItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } }, // add _id to the array if it's not there yet
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        // return res.status(NOT_FOUND_ERROR).send({ message: err.message });
        next(new NotFoundError(err.message));
      }
      if (err.name === "CastError") {
        // return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
      // console.error(err);
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
    });
};

// Unlike Clothing Item

const unLikeClothingItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } }, // add _id to the array if it's not there yet
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        // return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
        next(new BadRequestError("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        // return res.status(NOT_FOUND_ERROR).send({ message: err.message });
        next(new NotFoundError("Item not found"));
      } else {
        next(err);
      }

      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
    });
};

// DELETE Clothing Item

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        // Item no longer exists in the database
        // return res.status(NOT_FOUND_ERROR).send({ message: "Item not found" });
        next(new NotFoundError("Item Not Found"));
      }
      if (String(item.owner) !== req.user._id) {
        // return res.status(FORBIDDEN_ERROR).send({
        //   message: "Cannot delete item added by another user",
        // });
        next(new ForbiddenError("Cannot delete item added by another user"));
      }
      return item.deleteOne().then(() => res.send({ message: "Item deleted" }));
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "CastError") {
        // return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
    });
  // ClothingItem.exists({ _id: itemId }).then((itemExists) => {
  //   if (!itemExists) {
  //     console.log("Item is missing from the database"); // Item is missing
  //   } else {
  //     console.log("Item is still in the database"); // Item is still present
  //   }
  // });
};

module.exports = {
  createItem,
  getClothingItems,
  deleteClothingItem,
  likeClothingItem,
  unLikeClothingItem,
};
