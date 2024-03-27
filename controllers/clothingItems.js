const ClothingItem = require("../models/clothingItem");

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
        return res.status(400).send({ message: err.message });
      } else if (!name || !weather || !imageUrl) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      res.status(500).send({ message: err.message });
    });
};

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      if (!items) {
        // Item no longer exists in the database
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(200).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const likeClothingItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } }, // add _id to the array if it's not there yet
    { new: true },
  )
    .orFail(() => {
      const error = new Error("DocumentNotFoundError");
      err.statusCode = 404;
      throw error;
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(404).send({ message: err.message });
      }
      if (err.name === "CastError") {
        res.status(400).send({ message: err.message });
      }
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const unLikeClothingItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } }, // add _id to the array if it's not there yet
    { new: true },
  )
    .orFail(() => {
      const error = new Error("DocumentNotFoundError");
      err.statusCode = 404;
      throw error;
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res.status(400).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        res.status(404).send({ message: err.message });
      }

      return res.status(500).send({ message: err.message });
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        // Item no longer exists in the database
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(404).send({ message: err.message });
      }
      if (err.name == "CastError") {
        return res.status(400).send({ message: err.message });
      }
      console.error(err);
      return res.status(500).send({ message: err.message });
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
