import React, { useState, useEffect } from "react";
import { Table, Button, Image } from 'antd';
import axios from 'axios';
import { URL_PRODUCT } from '../../utils/Endpoint';
import { Link } from 'react-router-dom';
import '../../style.css';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

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
            render: (_, __, index) => index + 1, // row numbering
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Stok',
            dataIndex: 'stok',
            key: 'stok',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `Rp ${price.toLocaleString('id-ID')}`,
        },
        {
            title: 'Kategori',
            dataIndex: 'kategory',
            key: 'kategory',
        },
        {
            title: "Gambar",
            dataIndex: "thumbnail",
            render: (_, record) => {
                console.log('recor', record);
                return <Image src={record?.thumbnail} width={100} loading="lazy" />
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button type="primary" icon={<EditOutlined />}>
                        <Link to={`/dashboard/products/${record?._id}`}></Link>
                    </Button>
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
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
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div>
            <h1>List Product</h1>
            <Link to={'/dashboard/products/create'}>
                <Button type="primary">Tambah</Button>
            </Link>
            <Table
            dataSource={Products}
            columns={column}
            loading="loading"
            pagination={{ 
                pageSize: 4, 
                showSizeChanger: false,
                className: 'custom-pagination',
            }}
            />
        </div>
    );
};

export default Product;