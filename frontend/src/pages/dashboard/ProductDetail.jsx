import React, { useState, useEffect } from "react";
import { Image, message } from 'antd';
import axios from 'axios';
import { URL_PRODUCT, URL_KATEGORI } from '../../utils/Endpoint';
import { Link, useParams } from 'react-router-dom';
import '../../style.css';

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

    const kategori = (categoryId) => {
        const category = categories.find((cat) => String(cat._id) === String(categoryId));
        return category ? category.nama_kategori : "Tidak Diketahui";
    }

    return (
        <div className="border border-stone-300 py-4 px-8">
            <div className="px-36 mx-10 flex justify-center items-stretch h-full">
                
                <div className="flex-none">
                    <div className="p-4 rounded-lg border h-full">
                        <Image
                            src={Products.thumbnail}
                            style={{ height: '20vh', objectFit: 'cover' }}
                            alt="Foto produk"
                            loading="lazy"
                        />
                    </div>
                </div>
                
                <div className="flex-1 ms-5">
                    <table className="min-w-full border border-separate rounded-md divide-y divide-x">
                        <tbody>
                            <tr className="grid grid-cols-3 border-b divide-x">
                                <td className="text-base p-2">Nama Produk</td>
                                <td className="text-base p-2 col-span-2">{Products.name}</td>
                            </tr>
                            <tr className="grid grid-cols-3 border-b divide-x">
                                <td className="text-base p-2">Stok</td>
                                <td className="text-base p-2 col-span-2">{Products.stok}</td>
                            </tr>
                            <tr className="grid grid-cols-3 border-b divide-x">
                                <td className="text-base p-2">Harga</td>
                                <td className="text-base p-2 col-span-2">
                                    Rp {Products.price?.toLocaleString('id-ID')}
                                </td>
                            </tr>
                            <tr className="grid grid-cols-3 divide-x">
                                <td className="text-base p-2">Kategori</td>
                                <td className="text-base p-2 col-span-2">
                                    {kategori(Products.category_id)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="mt-5">
                <h1 className="text-base font-medium mb-5">Deskripsi</h1>
                <p>
                    {Products.description}
                </p>
            </div>
        </div>
    );
    
    
};

export default DetailProduct;
