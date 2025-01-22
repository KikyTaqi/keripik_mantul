import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Select, ConfigProvider } from "antd";
import axios from "axios";
import { URL_ONGKIR } from '../../utils/Endpoint';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;

const UpdateOngkir = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const params = useParams();

    const { id } = params;
    const [ongkir, setOngkir] = useState(null);

    const navigate = useNavigate(); // Hook utk navigasi

    useEffect(() => {
        axios
            .get(`${URL_ONGKIR}/${id}`)
            .then((res) => {
                console.log(res);
                setOngkir(res.data);
                form.setFieldsValue({
                    jarak_min: res.data.jarak_min,
                    jarak_max: res.data.jarak_max,
                    ongkir: res.data.ongkir
                });                
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    // fn -> submit form
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await axios.patch(`${URL_ONGKIR}/${id}`, {
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

                <Form.Item className="flex justify-end">
                    <Button type="primary" htmlType="submit" loading={loading} className="bg-red-800 hover:bg-red-700 text-white font-semibold rounded-3xl h-6 py-4 justify-items-center text-base">
                        Update Ongkir
                    </Button>
                </Form.Item>
            </Form>
        </div>
        </ConfigProvider>
    );
};

export default UpdateOngkir;