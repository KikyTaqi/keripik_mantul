const express = require('express');
const { 
    createTransaction,
    getProducts,
    findProducts,
} = require("../controllers/TransactionController");

const router = express.Router();

router.post('/', createTransaction);
router.post('/products', getProducts);
router.post('/products/get', findProducts);

module.exports = router;