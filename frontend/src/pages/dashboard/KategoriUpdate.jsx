import React, { useState, useEffect } from "react";
import { Form, Input, Button,  message, Select, Image, ConfigProvider } from "antd";
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
                console.log("Res data: "+res.data.nama_kategori);
                setKategori(res.data);
                form.setFieldsValue({
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
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#800000',
                }
            }}
        >
        <div className="border border-stone-300 py-4 px-8">
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
                    label='Nama Kategori'
                    rules={[{ required: true, message: 'Please input product name!' }]}
                >
                    <Input placeholder="Enter product name" />
                </Form.Item>
                <Form.Item className="flex justify-end">
                    <Button type="secondary" htmlType="submit" loading={loading} className="bg-red-800 hover:bg-red-700 text-white font-semibold rounded-3xl h-6 py-4 justify-items-center text-base">
                        Update Kategori
                    </Button>
                </Form.Item>
            </Form>
        </div>
        </ConfigProvider>
    );
};

export default UpdateKategori;

