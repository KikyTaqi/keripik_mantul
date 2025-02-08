import { useState, useEffect } from "react";
import { Input, Button, Form, Alert, Checkbox, Space, ConfigProvider } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from 'axios';
import { URL_USER } from "../../utils/Endpoint"; 
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function UserChangePassword() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [profile, setProfile] = useState({});
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
        let id = profile[0]?._id;
        let data = {
            id: id,
            password: values.password,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword
        };
        if(values.password == null){
            console.log("sdad: "+values.password);
            data = {
                id: id,
                password: null,
                newPassword: values.newPassword,
            };
        }else{
            data = {
                id: id,
                password: values.password,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword
            };
        }
        console.log(data);
        axios
            .post(`${URL_USER}/profile/edit/password`, data)
            .then((res) => {
                setLoading(false);
                navigate("/profile");
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
            <div className="border p-2 border-[#F2E8C6]">
                <div className="bg-[#F2E8C6] rounded-md text-center p-1 text-black mb-2">
                    <h1 className="font-bold text-lg">Ubah Password</h1>
                </div>
            {errMsg !== "" && (
                <div style={{ padding: "px-10" }}>
                    <Alert message={errMsg} type="error" />
                </div>
            )}
                <div className={`flex items-center justify-center`}>
                    <div className="bg-white rounded-lg w-2/4">
                        <h3 className="text-center font-semibold text-red-800"
                            style={{
                                display: profile[0]?.password != null ? 'none' : 'block'
                            }}>
                            Akun ada belum memiliki password! Segera tambahkan password<br />untuk keamanan akun anda.
                        </h3>
                        <Form
                            form={form}
                            onFinish={handleSubmit}
                            autoComplete="off"
                            layout="vertical"
                            className="my-6"
                        >
                            <Form.Item
                                style={{
                                    display: profile[0]?.password != null ? 'block' : 'none'
                                }}
                                name='password'
                                label='Password Saat Ini'
                                rules={[{ required: profile[0]?.password != null ? true : false, message: 'Please input your password!' }]}
                            >
                                <Input.Password 
                                placeholder="Masukkan password saat ini" 
                                size="large"
                                autoComplete="off"
                                value={`${profile[0]?.password == null ? 'no_pw' : ''}`}
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
                                style={{
                                    display: profile[0]?.password != null ? 'block' : 'none'
                                }}
                                name='confirmPassword'
                                label='Konfirmasi Password Baru'
                                dependencies={['password']}
                                rules={[
                                    { required: profile[0]?.password != null ? true : false, message: 'Please confirm your password!' },
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
            </div>
        </ConfigProvider>
    );
};

export default UserChangePassword;
