import React, { useEffect, useState } from "react";
import axios from "axios";
import Online from "../../assets/OnlineShopping.svg";
import Product from "../../assets/Product.svg";
import Ulasan from "../../assets/Ulasan.svg";
import People from "../../assets/People.svg";

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState([]); 
    const [productsCount, setProductsCount] = useState(0);
    const [usersCount, setUsersCount] = useState(0);
    const [ordersCount, setOrdersCount] = useState(0);

    useEffect(() => {
        fetchProducts();
        fetchOrders();
        fetchUser();
    }, []);

    const fetchProducts = async () => {
        const response = await axios.get("http://localhost:4000/api/products");
        setProducts(response.data);
        setProductsCount(response.data.length);
        const filteredProducts = response.data.slice(0, 5).map(({ thumbnail, _id, __v, cloudinaryId, ...rest }) => rest);
        setProducts(filteredProducts);
    };

    const fetchUser = async () => {
        const response = await axios.get("http://localhost:4000/api/users");
        setUser(response.data);
        setUsersCount(response.data.length);
    };

    const fetchOrders = async () => {
        const response = await axios.get("http://localhost:4000/orders");
        setOrders(response.data);
    };

    return (
        <div>
            <div className="pt-5 px-5" style={{ background: "linear-gradient(to bottom, #F2E8C6 60%, white 40%)" }}>
                <div className="gap-1 justify-around flex mb-5">
                    <div className="outline outline-3 outline-red-800 border-0 bg-white rounded-md flex items-center justify-center mx-3" style={{ width: "100%", height: "100px" }}>
                        <div className="flex-1 text-center">
                            <h1 className="font-bold text-start text-3xl ml-3" style={{ color: "#800000" }}>100</h1>
                            <h4 className="ml-2">Pesanan Masuk</h4>
                        </div>
                        <div className="flex-1">
                            <img src={Online} alt="" className="mx-auto" />
                        </div>
                    </div>
    
                    <div className="outline outline-3 outline-red-800 border-0 bg-white rounded-md flex items-center justify-center mx-3" style={{ width: "100%", height: "100px" }}>
                        <div className="flex-1 text-center">
                            <h3 className="font-bold text-start text-3xl ml-3" style={{ color: "#800000" }}>{productsCount}</h3>
                            <h4>Total Produk</h4>
                        </div>
                        <div className="flex-1">
                            <img src={Product} alt="" className="mx-auto" />
                        </div>
                    </div>
    
                    <div className="outline outline-3 outline-red-800 border-0 bg-white rounded-md flex items-center justify-center mx-3" style={{ width: "100%", height: "100px" }}>
                        <div className="flex-1 text-center">
                            <h3 className="font-bold text-start text-3xl ml-3" style={{ color: "#800000" }}>100</h3>
                            <h4>Total Ulasan</h4>
                        </div>
                        <div className="flex-1">
                            <img src={Ulasan} alt="" className="mx-auto" />
                        </div>
                    </div>
    
                    <div className="outline outline-3 outline-red-800 border-0 bg-white rounded-md flex items-center justify-center mx-3" style={{ width: "100%", height: "100px" }}>
                        <div className="flex-1 text-center">
                            <h3 className="font-bold text-start text-3xl ml-3" style={{ color: "#800000" }}>{usersCount}</h3>
                            <h4 className="ml-2">Total Customer</h4>
                        </div>
                        <div className="flex-1">
                            <img src={People} alt="" className="mx-auto" />
                        </div>
                    </div>
                </div>
            </div>
    
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Table title="Produk Terlaris" headers={["NO", "Nama Produk", "Stok", "Harga"]} data={products} />
                <Table title="Pesanan Terbaru" headers={["NO", "Customer", "Produk", "Total Harga", "Tanggal Pesanan"]} data={orders} />
            </div>
        </div>
    );
};

const Table = ({ title, headers, data }) => (
    <div style={{ width: "48%", backgroundColor: "#fff", padding: "20px", borderRadius: "10px" }}>
        <h3 className="font-bold mb-5">{title}</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
                <tr>
                    {headers.map((header) => (
                        <th style={{ border: "1px solid #ddd", background: "#F2E8C6", padding: "8px" }} key={header}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>{index + 1}</td>
                        {Object.values(item).map((cell, idx) => (
                            <td style={{ border: "1px solid #ddd", padding: "8px" }} key={idx}>{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default Dashboard;
