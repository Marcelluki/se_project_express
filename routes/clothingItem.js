const router = require("express").Router();

const {
  createItem,
  getClothingItems,
  deleteClothingItem,
  likeClothingItem,
  unLikeClothingItem,
} = require("../controllers/clothingItems");

router.post("/", createItem);
router.get("/", getClothingItems);
router.put("/:itemId/likes", likeClothingItem);
router.delete("/:itemId/likes", unLikeClothingItem);

router.delete("/:itemId", deleteClothingItem);

module.exports = router;
