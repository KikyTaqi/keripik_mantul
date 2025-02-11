const Transaction = require("../models/Transaction");
const Product = require("../models/Product");
const Alamat = require("../models/Alamat");
const midtransClient = require("midtrans-client");
const jwt = require('jsonwebtoken');
const secretkey = process.env.JWT_SECRET;

exports.createTransaction = async (req, res) => {
    try {
        const { user_id, first_name, item_details, alamat_id, shipping_cost, gross_amount } = req.body;

        const snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVERKEY,
        });

        const alamat = await Alamat.findOne({ "alamat._id": alamat_id });

        const order_id = "ORDER-" + new Date().getTime();
        const totalAmount = item_details.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const parameter = {
            transaction_details: {
              order_id,
              gross_amount: totalAmount + shipping_cost, // Tambahkan ongkir ke total harga
            },
            item_details: [
              ...item_details.map(item => ({
                id: item.id,
                price: item.price,
                quantity: item.quantity,
                name: item.name,
              })),
              {
                id: "SHIPPING",
                price: shipping_cost,  // Ongkir sebagai item tambahan
                quantity: 1,
                name: "Biaya Pengiriman",
              },
            ],
            customer_details: {
              first_name,
            //   address: {
            //     street: alamat.alamat[0].nama_jalan,
            //     city: alamat.alamat[0].kecamatan,
            //   },
            },
          };
          

        const transaction = await snap.createTransaction(parameter);
        const transactionUrl = transaction.redirect_url;

        const newTransaction = new Transaction({
            user_id,
            first_name: first_name,
            alamat_id: alamat_id,
            transaction_id: order_id,
            midtrans_url: transactionUrl,
            status: "pending",
            gross_amount: totalAmount,
            item_details: item_details,
        });

        await newTransaction.save();

        res.status(201).json({ midtrans_url: transactionUrl, transaction: transaction });
    } catch (err) {
        console.error("Error: "+err);
        res.status(500).json({ message: "Error creating transaction", error: err.message });
    }
};

// exports.handleMidtransNotification = async (req, res) => {
//     try {
//         const notification = req.body;
//         const { order_id, transaction_status } = notification;

//         console.log("Midtrans Notification:", notification);

//         // Cek status pembayaran
//         let status;
//         if (transaction_status === "capture" || transaction_status === "settlement") {
//             status = "success";
//         } else if (transaction_status === "pending") {
//             status = "pending";
//         } else {
//             status = "failed";
//         }

//         // Update status transaksi di database
//         await Transaction.findOneAndUpdate(
//             { transaction_id: order_id },
//             { status: status },
//             { new: true }
//         );

//         res.status(200).json({ message: "Notification processed", status });
//     } catch (error) {
//         console.error("Error handling notification:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// };


exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findOne({ "_id": req.body.productId });
        
        const productPayload = {
            _id: products._id,
            name: products.name,
        }
        // console.log("PRODUKKKKPAYLOADaddaad: "+JSON.stringify(productPayload));
    
        const cartItems = jwt.sign(productPayload, secretkey, { expiresIn: '1h' });
        res.status(200).json(cartItems);
    } catch (err) {
        res.status(500).json({message: err.message})
    }
};
exports.findProducts = async (req,res) => {
    const {id} = req.body;

    try{
        const product = await Product.findOne({ _id: id });
        res.status(200).json(product);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}