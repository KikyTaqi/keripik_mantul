import React, { useState, useEffect } from "react";
import axios from 'axios';
import { URL_ULASAN, URL_PRODUCT } from '../../utils/Endpoint';
import { FaRegTrashCan } from "react-icons/fa6";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { Button, ConfigProvider, Popconfirm, Table, message } from 'antd';

const Ulasan = () => {
    const [ulasans, setUlasans] = useState([]);
    const [products, setProducts] = useState([]); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ulasanResponse, productResponse] = await Promise.all([
                axios.get(URL_ULASAN),
                axios.get(URL_PRODUCT)
            ]);

            setUlasans(ulasanResponse.data);
            setProducts(productResponse.data);
        } catch (err) {
            message.error("Gagal memuat data!");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getProductName = (productId) => {
        const product = products.find((p) => p._id === productId);
        return product ? product.name : "Produk Tidak Ditemukan";
    };

    const toggleVisibility = async (id, currentStatus) => {
        try {
            const updatedStatus = !currentStatus;
            await axios.patch(`${URL_ULASAN}/${id}/toggle`, { isActive: updatedStatus });

            setUlasans((prev) =>
                prev.map((ulasan) =>
                    ulasan._id === id ? { ...ulasan, isActive: updatedStatus } : ulasan
                )
            );
            message.success(`Ulasan ${updatedStatus ? "ditampilkan" : "disembunyikan"}!`);
        } catch (error) {
            message.error("Gagal mengubah status ulasan!");
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`${URL_ULASAN}/${id}/delete`);
            message.success("Ulasan berhasil dihapus!");
            setUlasans((prev) => prev.filter((ulasan) => ulasan._id !== id));
        } catch (err) {
            message.error("Gagal menghapus ulasan!");
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
            width: "5%",
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Nama Produk',
            dataIndex: 'product',
            key: 'product',
            align: "center",
            render: (productId) => getProductName(productId),
        },
        {
            title: 'Nama Pengguna',
            dataIndex: 'username',
            key: 'username',
            align: "center",
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            align: "center",
            render: (rating) => `${rating} ⭐`,
        },
        {
            title: 'Komentar',
            dataIndex: 'comment',
            key: 'comment',
            align: "center",
        },
        {
            title: 'Aksi',
            key: 'action',
            width: "15%",
            align: "center",
            render: (_, record) => (
                <>
                    <Button
                        type="secondary"
                        className={`border-2 me-2 ${
                            record.isActive
                                ? "border-green-600 hover:border-green-500 text-green-600"
                                : "border-gray-500 hover:border-gray-400 text-gray-500"
                        }`}
                        onClick={() => toggleVisibility(record._id, record.isActive)}
                    >
                        {record.isActive ? <LuEye /> : <LuEyeClosed />}
                    </Button>

                    <Popconfirm
                        title="Hapus ulasan?"
                        description="Apakah kamu yakin ingin menghapus ulasan ini?"
                        onConfirm={() => handleDelete(record?._id)}
                        okButtonProps={{ style: { backgroundColor: "#800000" } }}
                        cancelButtonProps={{ style: { borderColor: "#800000", color: "#800000" } }}
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

    return (
        <ConfigProvider
            theme={{
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
                <h1 className="font-bold mt-1">Daftar Ulasan Produk</h1>
                <Table
                    dataSource={ulasans}
                    columns={columns}
                    loading={loading}
                    bordered
                    className="mt-4"
                    pagination={{
                        pageSize: 5,
                        showSizeChanger: false,
                        className: 'custom-pagination',
                    }}
                    rowKey={(record) => record._id}
                />
            </div>
        </ConfigProvider>
    );
};

export default Ulasan;
