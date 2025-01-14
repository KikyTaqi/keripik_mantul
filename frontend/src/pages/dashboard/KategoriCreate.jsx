import React, { useState } from "react";
import { Form, Input, Button, Upload, message, Select } from "antd";
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
        <div>
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

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Add Kategori
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddKategori;