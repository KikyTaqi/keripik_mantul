const express = require("express");
const { createReview, getReviewsByProduct, getReviews } = require("../controllers/UlasanController");
const router = express.Router();

router.get("/", getReviews);
router.post("/:id/ulasan", createReview);
router.get("/:id", getReviewsByProduct);

module.exports = router;
