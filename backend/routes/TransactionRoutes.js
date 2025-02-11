const express = require('express');
const { 
    createTransaction,
    getProducts,
    findProducts,
} = require("../controllers/TransactionController");

const router = express.Router();
router.get("/", (req, res) => {
    console.log("Transactions route accessed");
    res.send("Transaction API is working!");
});
router.post("/checkout", createTransaction);
router.post('/products', getProducts);
router.post('/products/get', findProducts);

module.exports = router;