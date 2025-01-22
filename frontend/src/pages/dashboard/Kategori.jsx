import React, { useState, useEffect } from "react";
import axios from 'axios';
import { URL_KATEGORI } from '../../utils/Endpoint';
import { FaCirclePlus, FaPencil, FaRegTrashCan, FaHandPointer } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import '../../style.css';
import {Button, Image, ConfigProvider, Popconfirm, Table, message } from 'antd';

const Kategori = () => {
    const [Kategoris, setKategoris] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [kategoriResponse] = await Promise.all([
                    axios.get(URL_KATEGORI)
                ]);

                setKategoris(kategoriResponse.data);
            } catch (err) {
                message.error("Gagal memuat data!");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const columns = [
            {
                title: "NO",
                key: "no",
                align: "center",
                width: "5px",
                render: (_, __, index) => index + 1, // row numbering
            },
            {
                title: 'Nama Kategori',
                dataIndex: 'nama_kategori',
                key: 'nama_kategori',
                align: "center",
            },     
            {
                title: 'Aksi',
                key: 'action',
                width: "15%",
                align: "center",
                render: (_, record) => (
                    <>
                        <Link to={`/dashboard/kategori/edit/${record?._id}`}>
                            <Button
                                type="secondary"
                                className="border-2 border-red-800 hover:border-red-600 hover:text-red-700 me-2"
                            >
                                <FaPencil />
                            </Button>
                        </Link>
                        <Popconfirm
                            title="Hapus kategori?"
                            description="Apakah kamu yakin ingin menghapus kategori ini?"
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
    
        const handleDelete = async (id) => {
            setLoading(true);
            try {
                await axios.delete(`${URL_KATEGORI}/${id}`);
                message.success("Kategori berhasil dihapus!");
                setKategoris((prev) => prev.filter((kategori) => kategori._id !== id));
            } catch (err) {
                message.error("Gagal menghapus produk!");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const handleEdit = async(id) => {
            navigate(`/dashboard/kategori/${id}`);
        }

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
                    <h1 className="font-bold mt-1">Daftar Kategori Untuk Dikelola</h1>
                    
                    <div className="flex">
                        <Link to={'/dashboard/kategori/create'}>
                            <Button type="secondary" className="bg-red-800 hover:bg-red-700 text-white font-semibold rounded-3xl h-6 py-4 justify-items-center text-base"><FaCirclePlus /><span className="mb-1">Tambah Kategori</span></Button>
                        </Link>
                    </div>
                </div>
                <Table
                    dataSource={Kategoris}
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

export default Kategori;
