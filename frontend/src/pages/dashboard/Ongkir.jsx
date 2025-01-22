import React, { useState, useEffect } from "react";
import axios from 'axios';
import { URL_ONGKIR } from '../../utils/Endpoint';
import { FaCirclePlus, FaPencil, FaRegTrashCan } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import '../../style.css';
import {Button, Image, ConfigProvider, message, Table, Popconfirm } from 'antd';

const Ongkir = () => {
    const [ongkir, setOngkir] = useState([]);
    const [loading, setLoading] = useState([false]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [ongkirResponse] = await Promise.all([
                    axios.get(URL_ONGKIR)
                ]);

                setOngkir(ongkirResponse.data);
            } catch (err) {
                message.error("Gagal memuat data!");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEdit = async(id) => {
        navigate(`/dashboard/kategori/${id}`);
    }

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`${URL_ONGKIR}/${id}`);
            message.success("Data berhasil dihapus!");
            setOngkir((prev) => prev.filter((ongkirs) => ongkirs._id !== id));
        } catch (err) {
            message.error("Gagal menghapus data!");
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
            title: 'Jarak Minimal',
            dataIndex: 'jarak_min',
            key: 'jarak_min',
            align: "center",
        },     
        {
            title: 'Jarak Maximal',
            dataIndex: 'jarak_max',
            key: 'jarak_max',
            align: "center",
        },     
        {
            title: 'Ongkos Kirim',
            dataIndex: 'ongkir',
            key: 'ongkir',
            align: "center",
            render: (ongkir) => `Rp ${ongkir.toLocaleString('id-ID')}`,
        },     
        {
            title: 'Aksi',
            key: 'action',
            width: "15%",
            align: "center",
            render: (_, record) => (
                <>
                    <Link to={`/dashboard/ongkir/${record?._id}`}>
                        <Button
                            type="secondary"
                            className="border-2 border-red-800 hover:border-red-600 hover:text-red-700 me-2"
                        >
                            <FaPencil />
                        </Button>
                    </Link>
                    <Popconfirm
                        title="Hapus ongkir?"
                        description="Apakah kamu yakin ingin menghapus data ini?"
                        onConfirm={() => handleDelete(record?._id)}
                        okButtonProps={{ 
                            style: {
                                backgroundColor: "#800000",
                            }
                         }}
                         cancelButtonProps={{
                            style: {
                                borderColor: "#800000",
                                color: "#800000",
                            }
                         }}
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
                    <h1 className="font-bold mt-1">Daftar Ongkir Untuk Dikelola</h1>
                    
                    <div className="flex">
                        <Link to={'/dashboard/ongkir/create'}>
                            <Button type="secondary" className="bg-red-800 hover:bg-red-700 text-white font-semibold rounded-3xl h-6 py-4 justify-items-center text-base"><FaCirclePlus /><span className="mb-1">Tambah Kategori</span></Button>
                        </Link>
                    </div>
                </div>
                <Table
                    dataSource={ongkir}
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

export default Ongkir;
