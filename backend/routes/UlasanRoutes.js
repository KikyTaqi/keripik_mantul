const express = require("express");
const { createReview, getReviewsByProduct } = require("../controllers/UlasanController");
const router = express.Router();

router.post("/:id/ulasan", createReview);
router.get("/:id", getReviewsByProduct);

module.exports = router;
