import React, { useState, useEffect } from "react";
import { Table, Button, Image, ConfigProvider, message } from 'antd';
import axios from 'axios';
import { URL_USER } from '../../utils/Endpoint';
import { Link } from 'react-router-dom';
import '../../style.css';
import { FaCirclePlus, FaPencil, FaRegTrashCan } from "react-icons/fa6";

const Pesanan = () => {
    const [pesanan, setPesanan] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [pesananResponse] = await Promise.all([
                    axios.get(`${URL_USER}/customers`),
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
            title: 'Nama ',
            dataIndex: 'name',
            key: 'name',
            align: "center",
            render: (name) => {
                const user = pesanan.find((cat) => String(cat.name) === String(name));
                return name ? user.name : "(Kosong)";
            },
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            align: "center",
        },
        {
            title: 'No Telepon',
            dataIndex: 'no_telp',
            key: 'no_telp',
            align: "center",
            render: (no_telp) => {
                const user = pesanan.find((cat) => String(cat.no_telp) === String(no_telp));
                return no_telp ? user.no_telp : "(Kosong)";
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
                <div className="flex justify-between">
                    <h1 className="font-bold mt-1">Daftar Customer</h1>
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
