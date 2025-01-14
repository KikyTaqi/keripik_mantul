import React, { useState, useEffect } from "react";
import { Table, Button, Image, ConfigProvider, message, Popconfirm  } from 'antd';
import axios from 'axios';
import { URL_PRODUCT, URL_KATEGORI } from '../../utils/Endpoint';
import { Link } from 'react-router-dom';
import '../../style.css';
import { FaCirclePlus, FaPencil, FaRegTrashCan } from "react-icons/fa6";

const Product = () => {
    const [Products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productResponse, categoryResponse] = await Promise.all([
                    axios.get(URL_PRODUCT),
                    axios.get(URL_KATEGORI)
                ]);

                setProducts(productResponse.data);
                setCategories(categoryResponse.data);
            } catch (err) {
                message.error("Gagal memuat data!");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Kolom untuk tabel
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
        {
            title: "Gambar",
            dataIndex: "thumbnail",
            key: "thumbnail",
            render: (_, record) => (
                <Image src={record?.thumbnail} width={100} loading="lazy" />
            ),
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
                        <Button
                            type="secondary"
                            className="border-2 border-red-800 hover:border-red-600 hover:text-red-700 me-2"
                        >
                            <FaPencil />
                        </Button>
                    </Link>
                    <Popconfirm
                        title="Hapus produk?"
                        description="Apakah kamu yakin ingin menghapus produk ini?"
                        onConfirm={() => handleDelete(record?._id)}
                        okText="Iya"
                        cancelText="Batal"
                    >
                        <Button
                            type="secondary"
                            className="border-2 border-red-800 hover:border-red-600 hover:text-red-700"
                        >
                            <FaRegTrashCan />
                        </Button>
                    </Popconfirm>
                    
                </>
            ),
        },
    ];

    // Handle delete produk
    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`${URL_PRODUCT}/${id}`);
            message.success("Produk berhasil dihapus!");
            setProducts((prev) => prev.filter((product) => product._id !== id));
        } catch (err) {
            message.error("Gagal menghapus produk!");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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
                    <h1 className="font-bold mt-1">Daftar Produk Untuk Dikelola</h1>
                    
                    <div className="flex">
                        <Link to={'/dashboard/products/create'}>
                            <Button
                                type="secondary"
                                className="bg-red-800 hover:bg-red-700 text-white font-semibold rounded-3xl h-6 py-4 justify-items-center text-base"
                            >
                                <FaCirclePlus />
                                <span className="mb-1">Tambah Produk</span>
                            </Button>
                        </Link>
                    </div>
                </div>
                
                <Table
                    dataSource={Products}
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

export default Product;
