const router = require("express").Router();

const {
  createItem,
  getClothingItems,
  deleteClothingItem,
  likeClothingItem,
  unLikeClothingItem,
} = require("../controllers/clothingItems");
const authorizationMiddleware = require("../middlewares/auth");
const { validateItem, validateId } = require("../middlewares/validation");

// Create Clothing Item
router.post("/", authorizationMiddleware, validateItem, createItem);

// Get Clothing Items
router.get("/", getClothingItems);

// Like a Clothing Item
router.put(
  "/:itemId/likes",
  authorizationMiddleware,
  validateId,
  likeClothingItem,
);

// unLike a Clothing Item
router.delete(
  "/:itemId/likes",
  authorizationMiddleware,
  validateId,
  unLikeClothingItem,
);

// Delete a Clothing Item
router.delete(
  "/:itemId",
  authorizationMiddleware,
  validateId,
  deleteClothingItem,
);

module.exports = router;
