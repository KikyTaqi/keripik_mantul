import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, message, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { URL_PRODUCT, URL_KATEGORI } from "../../utils/Endpoint";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const AddProduct = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [kategori, setKategori] = useState([]); // Dipindahkan ke dalam komponen
    const navigate = useNavigate();

    // Fetch data kategori
    useEffect(() => {
        const fetchKategori = async () => {
            try {
                const response = await axios.get(URL_KATEGORI);
                setKategori(response.data); // Simpan data kategori ke state
            } catch (error) {
                console.error("Error fetching kategori:", error);
            }
        };

        fetchKategori();
    }, []);

    // Handle form submission
    const handleSubmit = async (values) => {
        setLoading(true);

        const data = new FormData();
        data.append("name", values.name);
        data.append("description", values.description);
        data.append("price", values.price);
        data.append("stok", values.stok);
        data.append("category_id", values.category_id);
        data.append("thumbnail", values.thumbnail[0].originFileObj);

        try {
            await axios.post(URL_PRODUCT, data);
            message.success("Product added successfully!");
            form.resetFields();
            setFileList([]);
            navigate("/dashboard/products");
        } catch (error) {
            message.error("Failed to add product!");
            console.log(values); // Data dari form
            console.log(data); // FormData yang dikirimkan

        } finally {
            setLoading(false);
        }
    };

    // Handle file upload changes
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    return (
        <div className="border border-stone-300 py-4 px-8">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="name"
                    label="Nama Produk"
                    rules={[{ required: true, message: "Mohon masukan nama produk!" }]}
                >
                    <Input placeholder="Masukan nama produk" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Deskripsi Produk"
                    rules={[{ required: true, message: "Mohon masukan deskripsi produk!" }]}
                >
                    <TextArea
                        placeholder="Masukan deskripsi produk"
                        autoSize={{ minRows: 8, maxRows: 8 }}
                    />
                </Form.Item>

                <Form.Item
                    name="stok"
                    label="Stok"
                    rules={[{ required: true, message: "Mohon masukan stok produk!" }]}
                >
                    <Input type="number" placeholder="Masukan stok produk" />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: "Mohon masukan harga produk!" }]}
                >
                    <Input type="number" placeholder="Masukan harga produk" />
                </Form.Item>

                <Form.Item
                    name="category_id"
                    label="Kategori"
                    rules={[{ required: true, message: "Mohon pilih kategori produk!" }]}
                >
                    <Select
                        showSearch
                        placeholder="Pilih kategori Produk"
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        options={kategori.map((item) => ({
                            label: item.nama_kategori,
                            value: item._id,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    name="thumbnail"
                    label="Thumbnail"
                    valuePropName="fileList"
                    getValueFromEvent={({ fileList }) => fileList}
                    rules={[{ required: true, message: "Mohon pilih gambar produk!" }]}
                >
                    <Upload
                        listType="picture"
                        fileList={fileList}
                        onChange={handleChange}
                        beforeUpload={() => false} // Menghindari upload otomatis
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Pilih gambar produk</Button>
                    </Upload>
                </Form.Item>

                <Form.Item className="flex justify-end">
                    <Button type="secondary" className="bg-red-800 hover:bg-red-700 text-white font-semibold rounded-3xl h-6 py-4 justify-items-center text-base" htmlType="submit" loading={loading}>
                        Simpan Produk
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddProduct;
