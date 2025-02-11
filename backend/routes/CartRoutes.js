const express = require("express");
const {
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity,
} = require("../controllers/CartController");

const router = express.Router();

router.get("/:id", getCart);
router.post("/add", addToCart);
router.post("/remove", removeFromCart);
router.post("/quantity/update", updateQuantity);

module.exports = router;
