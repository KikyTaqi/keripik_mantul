const Transaction = require("../models/Transaction");
const midtransClient = require("midtrans-client");

exports.createTransaction = async (req, res) => {
    try {
        const { first_name, amount, product_id } = req.body;
        let snap = new midtransClient.snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVERKEY,
        });

        const order_id = "ORDER-" + new Date().getTime()

        const parameter = {
            transaction_detail: {
                order_id: order_id,
                gross_amount: amount,
            },
            credit_card: {
                secure: true,
            },
            customer_detail: {
                first_name : first_name,
            },
        };

        const transaction = await snap.createTransaction(parameter);

        const transactionUrl = transaction.redirect_url;

        const newTransaction = new Transaction({
            ...req.body,
            midtrans_url: transactionUrl,
            transaction_id: order_id
        });

        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};