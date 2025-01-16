import React, { useState } from "react";
import { Form, Input, Button, Upload, message, Select } from "antd";
import axios from "axios";
import { URL_ONGKIR } from '../../utils/Endpoint';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const AddOngkir = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate(); // Hook utk navigasi

    // fn -> submit form
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await axios.post(URL_ONGKIR, {
                jarak_min: values.jarak_min,
                jarak_max: values.jarak_max,
                ongkir: values.ongkir
            });
            message.success('Ongkir added successfully!');
            form.resetFields();
            navigate('/dashboard/ongkir');
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            message.error("Failed to add ongkir!");
        } finally {
            setLoading(false);
        }
    };    

    return (
        <div>
            <Form 
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    category: 'electronics',
                }}
            >
                <Form.Item
                    name='jarak_min'
                    label='Jarak Minimal (Km)'
                    rules={[{ required: true, message: 'Mohon masukkan jarak minimal!' }]}
                >
                    <Input placeholder="Masukkan jarak minimal" />
                </Form.Item>
                <Form.Item
                    name='jarak_max'
                    label='Jarak Maksimal (Km)'
                    rules={[{ required: true, message: 'Mohon masukkan jarak maksimal!' }]}
                >
                    <Input placeholder="Masukkan jarak maksimal" />
                </Form.Item>
                <Form.Item
                    name='ongkir'
                    label='Ongkos Kirim'
                    rules={[{ required: true, message: 'Mohon masukkan ongkos kirim!' }]}
                >
                    <Input placeholder="Masukkan ongkos kirim" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Add Ongkir
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddOngkir;