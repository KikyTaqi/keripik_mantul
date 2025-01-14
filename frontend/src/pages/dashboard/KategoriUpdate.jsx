import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, message, Select, Image } from "antd";
import axios from "axios";
import { URL_KATEGORI } from '../../utils/Endpoint';
import { useNavigate, useParams } from 'react-router-dom';

const { Options } = Select;

const UpdateKategori = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const params = useParams();

    const { id } = params;
    const [kategori, setKategori] = useState(null);

    useEffect(() => {
        axios
            .get(`${URL_KATEGORI}/${id}`)
            .then((res) => {
                console.log(res);
                setKategori(res.data);
                form.setFieldValue({
                    nama_kategori: res.data.nama_kategori,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // Menggunakan PATCH untuk memperbarui kategori dengan ID
            await axios.patch(`${URL_KATEGORI}/${id}`, {
                nama_kategori: values.nama_kategori
            });
    
            message.success('Kategori updated successfully!');
            form.resetFields();  // Reset form setelah berhasil
            navigate('/dashboard/kategori');  // Navigasi kembali ke halaman kategori
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            message.error("Failed to update kategori!");
        } finally {
            setLoading(false);  // Set loading menjadi false setelah selesai
        }
    };
    
    

    return (
        <div>
            <h1>Edit Product</h1>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    category: "electronics",
                }}
            >
                <Form.Item
                    name='nama_kategori'
                    label='Product Name'
                    rules={[{ required: true, message: 'Please input product name!' }]}
                >
                    <Input placeholder="Enter product name" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Update Kategori
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UpdateKategori;

