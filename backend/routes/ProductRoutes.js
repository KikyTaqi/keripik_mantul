const express = require('express');
const multer = require('multer');
const {
    getProducts,
    createProduct,
    getDetailProduct,
    deleteProduct,
    updateProduct,
} = require("../controllers/ProductController");

const upload = multer({ dest: "uploads/products/" });

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getDetailProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id", upload.single("thumbnail"), updateProduct);
router.post("/", upload.single("thumbnail"), createProduct);

module.exports = router;