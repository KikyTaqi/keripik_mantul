import React, {useState, useEffect} from "react";
import { Card, Col, Row, Button, Typography, message, Skeleton } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { FaRegHeart } from "react-icons/fa"
import axios from "axios";
import { URL_PRODUCT } from "../utils/Endpoint";
import { Link } from "react-router-dom";
import '../style.css';

const { Title } = Typography;

const DetailProduct = () => {
    const [Products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const { id } = params;

    // Fetch data produk saat load page
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


    return (
        <div className="">
            <div className="flex bg-[#F2E8C6]">

            </div>
        </div>
    );
};

export default DetailProduct;