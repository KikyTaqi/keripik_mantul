import React, { useState } from "react";
import { Form, Input, Button, Upload, message, Select } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import axios from "axios";
import { URL_PRODUCT } from '../../utils/Endpoint';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const AddProduct = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);

    const navigate = useNavigate(); // Hook utk navigasi

    // fn -> submit form
    const handleSubmit = async (values) => {
        setLoading(true);

        console.log('values', values);
        const data = new FormData();
        data.append("name", values.name);
        data.append("price", values.price);
        data.append("thumbnail", values.thumbnail[0].originFileObj);
        console.log('data: ', data);
        console.log('FormData entries:');
        for (let pair of data.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }

        try {
            await axios.post(URL_PRODUCT, data);
            message.success('Product added successfully!');
            form.resetFields();
            setFileList([]);
            navigate('/dashboard/products');
        } catch (error) {
            message.error("Failed to add product!")
        } finally {
            setLoading(false);
        }
    };

    // fn -> perubahan file upload
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    return (
        <div>
            <h1>Add Product</h1>
            <Form 
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    category: 'electronics',
                }}
            >
                <Form.Item
                    name='name'
                    label='Product Name'
                    rules={[{ required: true, message: 'Please input product name!' }]}
                >
                    <Input placeholder="Enter product name" />
                </Form.Item>
                
                <Form.Item
                    name='price'
                    label='Price'
                    rules={[{ required: true, message: 'Please input price!' }]}
                >
                    <Input type="number" placeholder="Enter product price" />
                </Form.Item>

                <Form.Item
                    name='thumbnail'
                    label='Thumbnail'
                    valuePropName="fileList"
                    getValueFromEvent={({ fileList }) => fileList}
                    rules={[{ required: true, message: 'Please upload a thumbnail!' }]}
                >
                    <Upload
                        action='/upload' // atur endpoint
                        listType="picture"
                        fileList={fileList}
                        onChange={handleChange}
                        beforeUpload={() => false} // menghindari upload otomatis
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Add Product
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddProduct;