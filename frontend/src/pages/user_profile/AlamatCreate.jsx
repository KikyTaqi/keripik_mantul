import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Select, ConfigProvider, Switch } from "antd";
import axios from "axios";
import { URL_ALAMAT, URL_USER } from '../../utils/Endpoint';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const { Option } = Select;

const AddAlamat = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState("");

    const navigate = useNavigate(); // Hook utk navigasi

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("userToken");
            const decoded = jwtDecode(token); // Decode token untuk mendapatkan email
            const response = await axios.post(`${URL_USER}/profile`, { email: decoded.email });
            setUserId(response.data[0]._id);
        } catch (error) {
            console.error("Error fetching profile:", error); 
        }
    };

    // fn -> submit form
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const data = {
                nama: values.nama_lengkap,
                no_telp: values.no_telp,
                kecamatan: values.kecamatan,
                nama_jalan: values.nama_jalan,
                detail_lain: values.detail_lain,
                utama: values.utama,
            }
            console.log(data);
            await axios.post(`${URL_ALAMAT}/add`, {
                userId,
                nama: values.nama_lengkap,
                no_telp: values.no_telp,
                kecamatan: values.kecamatan,
                nama_jalan: values.nama_jalan,
                detail_lain: values.detail_lain,
                utama: values.utama,
            });
            message.success('Alamat berhasil ditambah!');
            form.resetFields();
            navigate('/profile/alamat');
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
        <div className="border p-2 border-[#F2E8C6]">
            <div className="bg-[#F2E8C6] rounded-md text-center p-1 text-black mb-2">
                <h1 className="font-bold text-lg">Alamat Tersimpan</h1>
            </div>

            <div className="rounded-2xl bg-transparent py-4 px-2">
                <div className="py-4 px-8">
                    <h1 className="font-semibold" style={{fontSize: '16px'}}>Tambah Alamat Baru</h1>
                    <div className="py-4" style={{
                        paddingRight: '6rem',
                        paddingLeft: '6rem',
                    }}>
                        <Form 
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={{
                                category: 'electronics',
                            }}
                        >
                            <Form.Item
                                name='nama_lengkap'
                                rules={[{ required: true, message: 'Mohon masukkan nama lengkap!' }]}
                            >
                                <Input placeholder="Nama Lengkap" className="focus:border-t-0 focus:border-s-0 focus:border-e-0 rounded-none focus:shadow-none p-0" style={{
                                    borderTop: 'none',
                                    borderRight: 'none',
                                    borderLeft: 'none',
                                }}/>
                            </Form.Item>
                            <Form.Item
                                name='no_telp'
                                rules={[{ required: true, message: 'Mohon masukkan nomor telepon!' }]}
                            >
                                <Input placeholder="Nomor Telepon" className="border-t-0 border-s-0 border-e-0 rounded-none focus:shadow-none p-0" style={{
                                    borderTop: 'none',
                                    borderRight: 'none',
                                    borderLeft: 'none',
                                }}/>
                            </Form.Item>
                            <Form.Item
                                name='kecamatan'
                                rules={[{ required: true, message: 'Mohon masukkan kecamatan, kota / kabupaten, provinsi, kode pos!' }]}
                            >
                                <Input placeholder="Kecamatan, Kota / Kabupaten, Provinsi, Kode Pos" className="border-t-0 border-s-0 border-e-0 rounded-none focus:shadow-none p-0" style={{
                                    borderTop: 'none',
                                    borderRight: 'none',
                                    borderLeft: 'none',
                                }}/>
                            </Form.Item>
                            <Form.Item
                                name='nama_jalan'
                                rules={[{ required: true, message: 'Mohon masukkan nama jalan, gedung, no. rumah!' }]}
                            >
                                <Input placeholder="Nama Jalan, Gedung, No. Rumah" className="border-t-0 border-s-0 border-e-0 rounded-none focus:shadow-none p-0" style={{
                                    borderTop: 'none',
                                    borderRight: 'none',
                                    borderLeft: 'none',
                                }}/>
                            </Form.Item>
                            <Form.Item
                                name='detail_lain'
                            >
                                <Input placeholder="Detail Lainnya (Contoh: Blok / Unit No. Patokan)" className="border-t-0 border-s-0 border-e-0 rounded-none focus:shadow-none p-0" style={{
                                    borderTop: 'none',
                                    borderRight: 'none',
                                    borderLeft: 'none',
                                }}/>
                            </Form.Item>
                            <div className="w-full flex justify-between h-fit mb-5" style={{borderBottom: '1px solid #d9d9d9', padding: '0'}}>
                                <h1 className="font-semibold m-0" style={{fontSize: '16px'}}>Atur Sebagai Alamat Utama</h1>
                                <Form.Item name="utama" valuePropName="checked" className="m-0">
                                    <Switch className="m-0" />
                                </Form.Item>
                            </div>

                            <Form.Item className="flex justify-center justify-items-center">
                                <Button type="secondary" htmlType="submit" loading={loading} className="bg-red-800 hover:bg-red-700 text-white font-semibold rounded-3xl h-6 py-4 justify-items-center text-base">
                                    Simpan
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
        </ConfigProvider>
    );
};

export default AddAlamat;