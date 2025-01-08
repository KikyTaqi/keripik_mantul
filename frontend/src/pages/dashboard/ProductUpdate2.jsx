import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, message, Select } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import axios from "axios";
import { URL_PRODUCT } from '../../utils/Endpoint';
import { useNavigate, useParams } from 'react-router-dom';

const { Options } = Select;

const UpdateProduct = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const params = useParams();

    const { id } = params;
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios
            .get(`${URL_PRODUCT}/${id}`)
            .then((res) => {
                console.log(res);
                setProduct(res.data);
                form.setFieldValue({
                    name: res.data.name,
                    price: res.data.price,
                });
                // Atur thmbnail saat ini 
                if (res.data.thumbnail) {
                    setFileList([
                        {
                            uid: "-1",
                            name: "thumbnail.png",
                            status: "done",
                            url: res.data.thumbnail,
                        },
                    ]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const data = new FormData();
        data.append('name', values.name);
        data.append('price', values.price);


        if (values.thumbnail !== undefined || values.thumbnail !== "undefined") {
            data.append("thumbnail", values.thumbnail[0].originFileObj);
        };

        try {
            await axios.patch(`${URL_PRODUCT}/${id}`);
            message.success("Product added successfully!");
            form.resetFields();
            setFileList([]);
            navigate("/dashboard/product");
        } catch (error) {
            message.error("Failed to add product!")
        } finally {
            setLoading(false);
        };
    };

    // Fn -> perubahan file upload
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

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
                    name='name'
                    label='Product Name'
                    rules={[{ required: true, message: 'Please input product name!' }]}
                >
                    <Input placeholder="Enter product name" />
                </Form.Item>
                
                <Form.Item
                    name='price'
                    label='price'
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
                    <p>
                        Current: {" "}
                        {product && product.thumbnail ? (
                            <a href={product.thumbnail}>{product.thumbnail}</a>
                        ) : (
                            "-"
                        )}
                    </p>
                    <Upload
                        action='/upload' // atur endpoint
                        listType="picture"
                        valuePropName='fileList'
                        getValueFromEvent={({ fileList }) => fileList}
                        rules={({ required: false })}
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

export default UpdateProduct;

