import React, { useState } from "react";
import { Form, Input, Button, message, Select, ConfigProvider } from "antd";
import axios from "axios";
import { URL_KATEGORI } from '../../utils/Endpoint';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const AddKategori = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate(); // Hook utk navigasi

    // fn -> submit form
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await axios.post(URL_KATEGORI, {
                nama_kategori: values.nama_kategori
            });
            message.success('Kategori added successfully!');
            form.resetFields();
            navigate('/dashboard/kategori');
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            message.error("Failed to add kategori!");
        } finally {
            setLoading(false);
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
            <h1>Add Kategori</h1>
            <Form 
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    category: 'electronics',
                }}
            >
                <Form.Item
                    name='nama_kategori'
                    label='Nama Kategori'
                    rules={[{ required: true, message: 'Please input kategori name!' }]}
                >
                    <Input placeholder="Enter kategori name" />
                </Form.Item>

                <Form.Item className="flex justify-end">
                    <Button type="secondary" htmlType="submit" loading={loading} className="bg-red-800 hover:bg-red-700 text-white font-semibold rounded-3xl h-6 py-4 justify-items-center text-base">
                        Add Kategori
                    </Button>
                </Form.Item>
            </Form>
        </div>
        </ConfigProvider>
    );
};

export default AddKategori;