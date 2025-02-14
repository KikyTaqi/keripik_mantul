const express = require('express');
const { 
    getOrders,
    createTransaction,
    getProducts,
    findProducts,
    updateStatus,
    getTransaction,
    getDetailTransaction,
    // handleMidtransNotification,
} = require("../controllers/TransactionController");

const router = express.Router();
router.get("/", getOrders);
router.get('/:id', getDetailTransaction);
router.post("/checkout", createTransaction);
router.post('/products', getProducts);
router.post('/products/get', findProducts);
router.post('/checkout/status', updateStatus);
router.get('/checkout/get/:id', getTransaction);
// router.post("/midtrans/notification", handleMidtransNotification);

module.exports = router;