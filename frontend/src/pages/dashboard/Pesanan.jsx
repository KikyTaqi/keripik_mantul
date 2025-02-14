import React, { useState, useEffect } from "react";
import { Table, Button, Image, ConfigProvider, message } from 'antd';
import axios from 'axios';
import { URL_TRANSACTION } from '../../utils/Endpoint';
import { Link, useNavigate } from 'react-router-dom';
import '../../style.css';
import { FaCirclePlus, FaPencil, FaRegTrashCan } from "react-icons/fa6";

const Pesanan = () => {
    const [pesanan, setPesanan] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [pesananResponse] = await Promise.all([
                    axios.get(`${URL_TRANSACTION}`),
                ]);

                setPesanan(pesananResponse.data);
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
            title: 'ID',
            dataIndex: 'transaction_id',
            key: 'ID',
            align: "center",
            onCell: (record) => {
                return {
                    style: { cursor: 'pointer' },
                    onClick: () => {
                        navigate(`/dashboard/pesanan/detail/${record?._id}`);
                    },
                };
            }
        },
        {
            title: 'Customer',
            dataIndex: 'first_name',
            key: 'first_name',
            align: "center",
            onCell: (record) => {
                return {
                    style: { cursor: 'pointer' },
                    onClick: () => {
                        navigate(`/dashboard/pesanan/detail/${record?._id}`);
                    },
                };
            }
        },
        {
            title: 'Produk',
            dataIndex: 'item_details',
            key: 'produk',
            align: "center",
            render: (items) => items.map(item => item.name).join(", "), // Gabungkan nama produk dengan koma
            onCell: (record) => {
                return {
                    style: { cursor: 'pointer' },
                    onClick: () => {
                        navigate(`/dashboard/pesanan/detail/${record?._id}`);
                    },
                };
            }
        },
        {
            title: 'Jumlah',
            dataIndex: 'item_details',
            key: 'jumlah',
            align: "center",
            render: (items) => items.reduce((total, item) => total + item.quantity, 0), // Menjumlahkan semua quantity
            onCell: (record) => {
                return {
                    style: { cursor: 'pointer' },
                    onClick: () => {
                        navigate(`/dashboard/pesanan/detail/${record?._id}`);
                    },
                };
            }
        },
        {
            title: 'Total Harga',
            dataIndex: 'gross_amount',
            key: 'price',
            align: "center",
            render: (price) => `Rp ${price.toLocaleString('id-ID')}`,
            onCell: (record) => {
                return {
                    style: { cursor: 'pointer' },
                    onClick: () => {
                        navigate(`/dashboard/pesanan/detail/${record?._id}`);
                    },
                };
            }
        },
        {
            title: 'Tanggal Pesanan',
            dataIndex: 'createdAt',
            key: 'tgl_pesanan',
            align: "center",
            render: (text) => new Date(text).toLocaleDateString("id-ID", { 
              day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" 
            }),
            onCell: (record) => {
                return {
                    style: { cursor: 'pointer' },
                    onClick: () => {
                        navigate(`/dashboard/pesanan/detail/${record?._id}`);
                    },
                };
            }
        },          
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'Status',
            align: "center",
            onCell: (record) => {
                return {
                    style: { cursor: 'pointer' },
                    onClick: () => {
                        navigate(`/dashboard/pesanan/detail/${record?._id}`);
                    },
                };
            }
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
                    <h1 className="font-bold mt-1">Tampilan pesanan Anda untuk dikelola lebih lanjut</h1>
                </div>

                <Table
                    dataSource={pesanan}
                    columns={columns}
                    loading={loading}
                    bordered
                    className="mt-4"
                    pagination={{
                        pageSize: 6,
                        showSizeChanger: false,
                        className: 'custom-pagination',
                    }}
                    rowKey={(record) => record._id}
                />
            </div>
        </ConfigProvider>
    );
};

export default Pesanan;
