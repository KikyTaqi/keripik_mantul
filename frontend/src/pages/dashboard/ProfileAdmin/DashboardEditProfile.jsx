import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Select, ConfigProvider } from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { URL_PROFILE, URL_USER } from "../../../utils/Endpoint";

const DashboardEditProfile = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState([]);
    const navigate = useNavigate();

    // Ambil data profil saat komponen pertama kali dimuat
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
        const token = localStorage.getItem("userToken");
        const decoded = jwtDecode(token); // Decode token untuk mendapatkan email
        const response = await axios.post(`${URL_USER}/profile`, { email: decoded.email });
        setProfile(response.data);
        } catch (error) {
        console.error("Error fetching profile:", error);
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            let id = null;
            profile.map((data) => (
                id = data._id
            ));

            const data = {
                id: id,
                nama: values.nama,
                // email: values.email,
                no_telp: values.no_telp
            }
            await axios.post(`${URL_PROFILE}/edit`, data).then((res) => {
                if(res){
                    console.log(res.data.user);
                    message.success('Profile edited successfully!');
                    form.resetFields();
                    navigate('/dashboard/profile');
                }
            });
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
    {profile.map((data, index) => (
      <div className="border border-stone-300 py-12 px-8 flex flex-col justify-center items-center" key={index}>
        <div className="flex gap-10">
            <div className="mb-4 flex flex-col text-end gap-5">
                <p className="font-semibold">Nama:</p>
                <p className="font-semibold">Nomor Telepon:</p>
            </div>
            <div className="flex flex-col text-start " style={{marginTop: "-15px"}}>
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
                        className="mt-2 mb-0"
                        name='nama'
                        rules={[{ required: true, message: 'Please input the name!' }]}
                    >
                        <Input placeholder="Masukkan nama" className="m-0 border-t-0 border-s-0 border-e-0 rounded-none focus:shadow-none p-0"/>
                    </Form.Item>
                    <Form.Item
                        className="mt-2 mb-0"
                        name='no_telp'
                        rules={[{ required: true, message: 'Please input the number!' }]}
                    >
                        <Input placeholder="Masukkan telepon" className="m-0 border-t-0 border-s-0 border-e-0 rounded-none focus:shadow-none p-0"/>
                    </Form.Item>
                </Form>
            </div>
        </div>
        <div className="flex justify-end gap-4 w-full mt-7">
            <Button type="secondary" htmlType="submit" loading={loading} form="form-1" className="bg-red-800 text-white px-4 pb-1 rounded-[30px] hover:bg-red-700">
            Simpan
            </Button>
        </div>
      </div>
    ))}
    </ConfigProvider>
  );
};

export default DashboardEditProfile;
