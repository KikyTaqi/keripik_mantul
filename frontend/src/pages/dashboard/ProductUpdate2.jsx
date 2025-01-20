import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, message, Select, Image, ConfigProvider } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import axios from "axios";
import { URL_PRODUCT, URL_KATEGORI } from '../../utils/Endpoint';
import { useNavigate, useParams } from 'react-router-dom';

const { Options } = Select;
const { TextArea } = Input;

const UpdateProduct = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const params = useParams();
    const [kategori, setKategori] = useState([]); // Dipindahkan ke dalam komponen

    const { id } = params;
    const [product, setProduct] = useState(null);

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

    useEffect(() => {
        axios
            .get(`${URL_PRODUCT}/${id}`)
            .then((res) => {
                console.log(res);
                setProduct(res.data);
                form.setFieldsValue({
                    name: res.data.name,
                    price: res.data.price,
                    description: res.data.description,
                    stok: res.data.stok,
                    category_id: res.data.category_id,
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
        setLoading(true);

        const data = new FormData();
        data.append('name', values.name);
        data.append('price', values.price);
        data.append('category_id', values.category_id);
        data.append('stok', values.stok);
        data.append('description', values.description);
    
        // Cek apakah values.thumbnail ada dan valid
        if (values.thumbnail && values.thumbnail.length > 0) {
            data.append("thumbnail", values.thumbnail[0].originFileObj);
        } else if (product && product.thumbnail) {
            // Jika tidak ada thumbnail baru, gunakan yang lama
            data.append("thumbnail", product.thumbnail);
        }
    
        console.log("Data upload: ", data.get("name"));
    
        try {
            await axios.patch(`${URL_PRODUCT}/${id}`, data);
            message.success("Product updated successfully!");
            form.resetFields();
            setFileList([]);
            navigate("/dashboard/products");
        } catch (error) {
            message.error("Failed to update product!");
        } finally {
            setLoading(false);
        }
    };
    

    // Fn -> perubahan file upload
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

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

                <div>
                    Current: {" "}<br></br>
                    {product && product.thumbnail ? (
                        
                        <Image
                            width={200}
                            src={product.thumbnail}
                        />
                    ) : (
                        "-"
                    )}
                </div>

                <Form.Item
                    name="thumbnail"
                    label="Thumbnail"
                    valuePropName="fileList"
                    getValueFromEvent={({ fileList }) => fileList}
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
        </ConfigProvider>
    );
};

export default UpdateProduct;