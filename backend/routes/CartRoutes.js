const express = require("express");
const { addToCart, removeFromCart, getCart } = require("../controllers/CartController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/add", authMiddleware, addToCart);
router.post("/remove", authMiddleware, removeFromCart);
router.get("/", authMiddleware, getCart);

module.exports = router;
