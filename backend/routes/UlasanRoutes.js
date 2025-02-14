const express = require("express");
const { createReview, getReviewsByProduct, getUlasan, deleteUlasan, updateUlasan, getReviews } = require("../controllers/UlasanController");
const router = express.Router();

router.get("/", getReviews);
router.post("/:id/ulasan", createReview);
router.get("/:id", getReviewsByProduct);
router.delete("/:id/delete", deleteUlasan);
// router.get("/", getUlasan);
router.patch("/:id/toggle", updateUlasan);

module.exports = router;
