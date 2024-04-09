const router = require("express").Router();

const {
  createItem,
  getClothingItems,
  deleteClothingItem,
  likeClothingItem,
  unLikeClothingItem,
} = require("../controllers/clothingItems");
const authorizationMiddleware = require("../middlewares/auth");

// Create Clothing Item
router.post("/", authorizationMiddleware, createItem);

// Get Clothing Items
router.get("/", getClothingItems);

// Like a Clothing Item
router.put("/:itemId/likes", authorizationMiddleware, likeClothingItem);

// unLike a Clothing Item
router.delete("/:itemId/likes", authorizationMiddleware, unLikeClothingItem);

// Delete a Clothing Item
router.delete("/:itemId", authorizationMiddleware, deleteClothingItem);

module.exports = router;
