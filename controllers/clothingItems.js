const ClothingItem = require("../models/clothingItem");
const {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  FORBIDDEN_ERROR,
} = require("../utils/errors");

// Create Clothing Item

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const userId = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner: userId })
    .then((item) => {
      console.log(item);
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// GET Clothing Items

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      // if (!items) {
      //   // Item no longer exists in the database
      //   return res.status(NOT_FOUND_ERROR).send({ message: "Item not found" });
      // }
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// Like Clothing Item

const likeClothingItem = (req, res) => {
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
        return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
      }
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// Unlike Clothing Item

const unLikeClothingItem = (req, res) => {
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
        return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// DELETE Clothing Item

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  console.log(itemId);
  // ClothingItem.findByIdAndDelete(itemId)
  //   .then((item) => {
  //     if (!item) {
  //       // Item no longer exists in the database
  //       return res.status(NOT_FOUND_ERROR).send({ message: "Item not found" });
  //     }
  //     if (item.owner.toString() !== userId.toString()) {
  //       return res.status(FORBIDDEN_ERROR).send({
  //         message: "Cannot delete item added by another user",
  //       });
  //     }
  //     return res.status(200).send(item);
  //   })
  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        // Item no longer exists in the database
        return res.status(NOT_FOUND_ERROR).send({ message: "Item not found" });
      }
      if (String(item.owner) !== req.user._id) {
        return res.status(FORBIDDEN_ERROR).send({
          message: "Cannot delete item added by another user",
        });
      }
      return item.deleteOne().then(() => res.send({ message: "Item deleted" }));
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
