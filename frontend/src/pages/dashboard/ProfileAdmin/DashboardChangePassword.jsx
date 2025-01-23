import { useState, useEffect } from "react";
import { Input, Button, Form, Alert, Checkbox, Space, ConfigProvider } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from 'axios';
import { URL_USER } from "../../../utils/Endpoint"; 
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function DashboardChangePassword() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");
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

    const handleSubmit = (values) => {
        setLoading(true);
        let id = null;
        profile.map((data) => (
            id = data._id
        ));
        console.log("Id: "+id);
        const data = {
            id: id,
            password: values.password,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword
        };
        console.log(data);
        axios
            .post(`${URL_USER}/profile/edit/password`, data)
            .then((res) => {
                console.log("res", res);
                navigate("/dashboard/profile");
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error:", err);
                if (err.response) {
                    setErrMsg(err.response.data.message);
                } else {
                    // setErrMsg("Terjadi kesalahan jaringan. Silakan coba lagi.");
                }
                setLoading(false);
            });
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#800000',
                }
            }}
        >
            {errMsg !== "" && (
                <div style={{ padding: "20px" }}>
                    <Alert message={errMsg} type="error" />
                </div>
            )}
            <div className="flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg w-2/4">
                    {/* <h3 className="text-center mb-6">
                        Silakan masukkan password baru yang ingin Anda <br /> gunakan. 
                    </h3> */}
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            name='password'
                            label='Password Saat Ini'
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password 
                            placeholder="Masukkan password saat ini" 
                            size="large"
                            autoComplete="off"
                            />
                        </Form.Item>

                        <Form.Item
                            name='newPassword'
                            label='Password Baru'
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password 
                            placeholder="Masukkan password baru" 
                            size="large"
                            autoComplete="off"
                            />
                        </Form.Item>
        
                        <Form.Item
                            name='confirmPassword'
                            label='Konfirmasi Password Baru'
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Please confirm your password!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Password tidak sama!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password 
                            placeholder="Konfirmasi password" 
                            size="large"
                            autoComplete="off"
                            />
                        </Form.Item>

                        <Form.Item className="mb-1">
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                loading={loading}
                                size="large"
                                className="rounded-full"
                                style={{ background: "#800000" }}
                            >
                                Simpan Password Baru
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </ConfigProvider>
    );
};

export default DashboardChangePassword;
