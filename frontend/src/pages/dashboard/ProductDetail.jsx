import React, { useState, useEffect } from "react";
import { Table, Button, Image, ConfigProvider, message } from 'antd';
import axios from 'axios';
import { URL_PRODUCT, URL_KATEGORI } from '../../utils/Endpoint';
import { Link, useParams } from 'react-router-dom';
import '../../style.css';
import { FaCirclePlus, FaPencil, FaRegTrashCan } from "react-icons/fa6";

const DetailProduct = () => {
    const [Products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const { id } = params;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log("ID", id);
                const [productResponse, categoryResponse] = await Promise.all([
                    axios.patch(`${URL_PRODUCT}/${id}`),
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
                    <h1 className="font-bold mt-1">Daftar Produk Untuk Dikelola</h1>
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

export default DetailProduct;
