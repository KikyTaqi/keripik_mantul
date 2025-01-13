import React, { useState, useEffect } from "react";
import { Table, Button, Image, ConfigProvider } from 'antd';
import axios from 'axios';
import { URL_PRODUCT } from '../../utils/Endpoint';
import { Link } from 'react-router-dom';
import '../../style.css';
import { FaCirclePlus, FaPencil, FaRegTrashCan } from "react-icons/fa6";

const Product = () => {
    const [Products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get(URL_PRODUCT)
            .then((res) => {
                console.log("res", res.data);
                setProducts(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err.response);
                setLoading(false);
            });
    }, []);

    // kolom utk tabel
    const column = [
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
            dataIndex: 'kategori',
            key: 'kategori',
            align: "center",
        },
        {
            title: "Gambar",
            dataIndex: "thumbnail",
            render: (_, record) => {
                console.log('recor', record);
                return <Image src={record?.thumbnail} width={100} loading="lazy" />
            },
            align: "center",
        },
        {
            title: 'Aksi',
            key: 'action',
            width: "15%",
            align: "center",
            render: (_, record) => (
                <>  
                    <Link to={`/dashboard/products/${record?._id}`}>
                        <Button type="secondary" className="border-2 border-red-800 hover:border-red-600 hover:text-red-700 me-2">
                            <FaPencil />
                        </Button>
                    </Link>
                    <Button
                        type="secondary"
                        className="border-2 border-red-800 hover:border-red-600 hover:text-red-700"
                        loading={loading}
                        onClick={() => {
                            console.log('id', record?._id);
                            axios
                                .delete(`${URL_PRODUCT}/${record?._id}`)
                                .then((res) => {
                                    console.log(res);
                                    window.location.reload();
                                })
                                .catch((err) => console.log('err', err));
                        }}
                    >
                        <FaRegTrashCan />
                    </Button>
                </>
            ),
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
                <div className="flex justify-between">
                    <h1 className="font-bold mb-5">Daftar Produk Untuk Dikelola</h1>
                    
                    <div className="flex">
                        <Link to={'/dashboard/products/create'}>
                            <Button type="secondary" className="bg-red-800 hover:bg-red-700 text-white font-semibold rounded-3xl h-8 py-5 justify-items-center text-base"><FaCirclePlus /> <span className="mb-1">Tambah Produk</span></Button>
                        </Link>
                    </div>
                </div>
                
                <Table
                dataSource={Products}
                columns={column}
                loading="loading"
                bordered
                className="mt-4"
                pagination={{ 
                    pageSize: 4, 
                    showSizeChanger: false,
                    className: 'custom-pagination',
                }}
                />
            </div>
        </ConfigProvider>
    );
};

export default Product;