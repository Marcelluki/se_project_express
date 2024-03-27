const router = require("express").Router();

const {
  createItem,
  getClothingItems,
  deleteClothingItem,
  likeClothingItem,
  unLikeClothingItem,
} = require("../controllers/clothingItems");

// Create Clothing Item
router.post("/", createItem);

// Get Clothing Items
router.get("/", getClothingItems);

// Like a Clothing Item
router.put("/:itemId/likes", likeClothingItem);

// unLike a Clothing Item
router.delete("/:itemId/likes", unLikeClothingItem);

// Delete a Clothing Item
router.delete("/:itemId", deleteClothingItem);

module.exports = router;
