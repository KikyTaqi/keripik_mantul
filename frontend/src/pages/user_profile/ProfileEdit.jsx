import React, { useState, useEffect } from "react";
import { Form, Input, Button, Image, ConfigProvider, message, Upload, DatePicker, Select  } from 'antd';
import { HiCheck } from "react-icons/hi2";
import axios from 'axios';
import { URL_USER, URL_PROFILE } from '../../utils/Endpoint';
import { Link, useNavigate } from 'react-router-dom';
import '../../style.css';
import {jwtDecode} from "jwt-decode";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import crypto from 'crypto';

const ProfileEdit = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState();
    const [image, setImage] = useState();
    const [form] = Form.useForm();

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
      };
      
      const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
          message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
      };

      const handleChange = (info) => {
        if (info.file.status === "uploading") {
            setLoading(true);
            return;
        }
    
        if (info.file.status === "done") {
            const uploadedFile = info.file.originFileObj; // Simpan file asli
            setImageUrl(uploadedFile); // Jangan pakai base64
            getBase64(info.file.originFileObj, (url) => {
                        setImage(url);
                    });
            setLoading(false);
        }
    
        if (info.file.status === "error") {
            message.error("Upload failed. Please try again.");
            setLoading(false);
        }
    };
    

    //   const handleChange = (info) => {
    //     console.log("Upload status:", info.file.status); // Debugging
        
    //     if (info.file.status === 'uploading') {
    //         setLoading(true);
    //         return;
    //     }

    //     if (info.file.status === 'done') {
    //         // Coba ambil URL dari server jika tersedia
    //         const uploadedUrl = info.file.response?.url; 
            
    //         getBase64(info.file.originFileObj, (url) => {
    //             setImageUrl(url);
    //         });
            
    //         setLoading(false);
    //     }
        
    //     if (info.file.status === 'error') {
    //         message.error('Upload failed. Please try again.');
    //         setLoading(false);
    //     }
    // };
        
    
      const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Upload</div>
        </button>
      );
      const handleChangeSelect = (value) => {
        console.log(`selected ${value}`);
      };

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("userToken");
                const decoded = jwtDecode(token); // Decode token untuk mendapatkan email
                const response = await axios.post(`${URL_USER}/profile`, { email: decoded.email });
                setUsers(response.data);
              } catch (error) {
                console.error("Error fetching profile");
                navigate("/signin");
              } finally {
                setLoading(false);
              }
        };

        fetchData();
    }, []);

    // const handleSubmit = async (values) => {
    //     setLoading(true);
    //     try {
    //         let id = null;
    //         users.map((data) => (
    //             id = data._id
    //         ));

    //         const data = {
    //             id: id,
    //             nama: values.nama,
    //             // email: values.email,
    //             no_telp: values.no_telp,
    //             tgl_lahir: values.tgl_lahir,
    //             jenis_kelamin: values.jenis_kelamin,
    //             image: imageUrl ? imageUrl : null,
    //         }
    //         await axios.post(`${URL_PROFILE}/edit`, data).then((res) => {
    //             if(res){
    //                 console.log(res.data.user);
    //                 message.success('Profile edited successfully!');
    //                 form.resetFields();
    //                 navigate('/profile');
    //             }
    //         });
    //     } catch (error) {
    //         console.error("Error:", error.response?.data || error.message);
    //         message.error("Failed to add kategori!");
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            let id = users.length > 0 ? users[0]._id : null;
    
            // Gunakan FormData
            const formData = new FormData();
            formData.append("id", id);
            formData.append("nama", values.nama);
            formData.append("no_telp", values.no_telp);
            formData.append("tgl_lahir", values.tgl_lahir);
            formData.append("jenis_kelamin", values.jenis_kelamin);
    
            if (imageUrl instanceof File) {
                formData.append("image", imageUrl);
            }
    
            // Kirim data ke server
            const response = await axios.post(`${URL_PROFILE}/edit`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
    
            if (response) {
                message.success("Profile edited successfully!");
                form.resetFields();
                navigate("/profile");
            }
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            message.error("Failed to edit profile!");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        const hash = new Date().getTime();
        const hashedImageUrl = imageUrl ? `${imageUrl}?hash=${hash}` : null;
        console.log("Updated Image URL:", imageUrl);
        console.log("Updated Image URL hashed:", hashedImageUrl);
    }, [imageUrl]);

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#800000',
                },
                components: {
                    Table: {
                        headerBg: "#F2E8C6",
                        headerBorderRadius: 0,
                        borderColor: "#B9B9B9",
                    },
                },
            }}
        >
        {users.map((data, index) => (
            <div className="border p-2 border-[#F2E8C6]" key={index}>
                <div className="bg-[#F2E8C6] rounded-md text-center p-1 text-black">
                    <h1 className="font-bold text-lg">Profil Saya</h1>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="flex justify-center mb-16 py-16">
                        <div className="flex items-stretch">
                            <div className="flex gap-10">
                                <div className="mb-4 flex flex-col text-end gap-7 mt-1 text-lg">
                                    <p className="font-medium text-right">Nama:</p>
                                    <p className="font-medium text-right">Nomor Telepon:</p>
                                    <p className="font-medium text-right">Tanggal Lahir:</p>
                                    <p className="font-medium text-right">Jenis Kelamin:</p>
                                </div>
                                <div className="flex flex-col text-start">
                                    <Form 
                                        form={form}
                                        id="form-1"
                                        layout="vertical"
                                        onFinish={handleSubmit}
                                        initialValues={{
                                            category: 'electronics',
                                        }}
                                    >
                                        <Form.Item
                                            className=""
                                            name='nama'
                                            rules={[{ required: true, message: 'Harap memasukkan nama!' }]}
                                        >
                                            <Input placeholder="Masukkan nama" className="text-lg font-sm focus:border-t-0 focus:border-s-0 focus:border-e-0 rounded-none focus:shadow-none p-0" style={{
                                                borderTop: 'none',
                                                borderRight: 'none',
                                                borderLeft: 'none',
                                            }}/>
                                        </Form.Item>
                                        <Form.Item
                                            className=""
                                            name='no_telp'
                                            rules={[{ required: true, message: 'Harap memasukkan nomor telepon!' }]}
                                        >
                                            <Input placeholder="Masukkan nomor telepon" className="text-lg font-sm focus:border-t-0 focus:border-s-0 focus:border-e-0 rounded-none focus:shadow-none p-0" style={{
                                                borderTop: 'none',
                                                borderRight: 'none',
                                                borderLeft: 'none',
                                            }}/>
                                        </Form.Item>
                                        <Form.Item
                                            className=""
                                            name='tgl_lahir'
                                            rules={[{ required: true, message: 'Harap memasukkan tanggal lahir!' }]}
                                        >
                                            <DatePicker placeholder="Masukkan tanggal lahir" className="text-lg font-sm focus:shadow-none w-full" style={{
                                                // borderTop: 'none',
                                                // borderRight: 'none',
                                                // borderLeft: 'none',
                                            }}/>
                                        </Form.Item>
                                        <Form.Item
                                            className=""
                                            name='jenis_kelamin'
                                            rules={[{ required: true, message: 'Harap memasukkan jenis kelamin!' }]}
                                        >
                                            <Select
                                                // defaultValue={'Laki-laki'}
                                                // initialValues={'Laki-laki'}
                                                placeholder="Pilih jenis kelamin"
                                                onChange={handleChangeSelect}
                                                options={[
                                                    {
                                                        label: 'Laki-laki',
                                                        value: 'Laki-laki',
                                                    },
                                                    {
                                                        label: 'Perempuan',
                                                        value: 'Perempuan',
                                                    },
                                                ]}
                                                className="text-lg font-sm focus:border-t-0 focus:border-s-0 focus:border-e-0 rounded-none focus:shadow-none p-0"
                                                style={{
                                                    borderTop: 'none',
                                                    borderRight: 'none',
                                                    borderLeft: 'none',
                                                }}
                                            />
                                        </Form.Item>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="mt-12 mx-16 mb-28 p-12">
                            <div className="border p-3 border-[#F2E8C6] w-fit">
                                <Upload
                                    name="avatar"
                                    listType="picture-circle"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    action="https://dummyjson.com/products/add"
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    style={{
                                        width: '20rem !important',
                                        // height: '100%',
                                        borderRadius: '100%',
                                        // padding: '2rem',
                                        objectFit: 'contain',
                                    }}
                                >
                                    {image ? <img src={image} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : uploadButton}
                                </Upload>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end pe-7 mb-5">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        disabled={loading}
                        form="form-1"
                        className="bg-red-800 hover:bg-red-700 text-white font-semibold rounded-3xl h-6 py-4 justify-items-center text-base w-28"
                    >
                        <HiCheck />
                        <span className="mb-1">Simpan</span>
                    </Button>
                </div>
            </div>
        ))}
        </ConfigProvider>
    );
};

export default ProfileEdit;
