import React, { useState, useEffect } from "react";
import { Table, Button, Image, ConfigProvider, message } from 'antd';
import { URL_PRODUCT, URL_KATEGORI } from '../../utils/Endpoint';
import { Link } from 'react-router-dom';
import '../../style.css';
import { FaCirclePlus, FaPencil, FaRegTrashCan } from "react-icons/fa6";
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
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchOrders();
        fetchUser();
        fetchData();
    }, []);

    const fetchProducts = async () => {
        const response = await axios.get("http://localhost:4000/api/products");
        setProducts(response.data);
        setProductsCount(response.data.length);
        const filteredProducts = response.data.slice(0, 5).map(({ thumbnail, __v, cloudinaryId, ...rest }) => rest);
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

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productResponse, categoryResponse] = await Promise.all([
                axios.get(URL_PRODUCT),
                axios.get(URL_KATEGORI)
            ]);

            setProducts(productResponse.data.slice(0, 5));
            setCategories(categoryResponse.data);
        } catch (err) {
            message.error("Gagal memuat data!");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
            {
                title: "NO",
                key: "no",
                align: "center",
                width: "5px",
                render: (_, __, index) => index + 1, // row numbering
            },
            {
                title: 'Nama Produk',
                dataIndex: 'name',
                key: 'name',
                align: "center",
            },
            {
                title: 'Stok',
                dataIndex: 'stok',
                key: 'stok',
                align: "center",
            },
            {
                title: 'Harga',
                dataIndex: 'price',
                key: 'price',
                align: "center",
                render: (price) => `Rp ${price.toLocaleString('id-ID')}`,
            },
            {
                title: 'Kategori',
                dataIndex: 'category_id',
                key: 'category_id',
                align: "center",
                render: (categoryId) => {
                    const category = categories.find((cat) => String(cat._id) === String(categoryId));
                    return category ? category.nama_kategori : "Tidak Diketahui";
                },
            },        
        ];

    return (
        <ConfigProvider
            theme={{
                token: {
                // Primary color untuk seluruh aplikasi
                },
                components: {
                    Table: {
                        headerBg: "#F2E8C6",
                        headerBorderRadius: 0,
                        borderColor: "#B9B9B9",
                    },
                },
            }}
        >
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
                    <h1 className="font-bold">Produk Terlaris</h1>
                    <Table
                        dataSource={products}
                        columns={columns}
                        loading={loading}
                        bordered
                        className="mt-4"
                        pagination={{ 
                            pageSize: 4, 
                            showSizeChanger: false,
                            className: 'custom-pagination',
                        }}
                        rowKey={(record) => record._id}
                    />
            </div>
        </ConfigProvider>
    );
};

export default Dashboard;
