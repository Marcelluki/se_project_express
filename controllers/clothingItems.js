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
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
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
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const unLikeClothingItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(
    itemId,
    { $pull: { likes: userId } }, // add _id to the array if it's not there yet
    { new: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      if (!item) {
        // Item no longer exists in the database
        return res.status(204).send({ message: "Item not found" });
      }
      res.status(204).send(item);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(200).send({ message: err.message });
      }
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

module.exports = {
  createItem,
  getClothingItems,
  deleteClothingItem,
  likeClothingItem,
  unLikeClothingItem,
};
