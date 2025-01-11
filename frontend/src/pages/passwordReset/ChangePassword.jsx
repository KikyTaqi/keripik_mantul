import { useState } from "react";
import { Input, Button, Form, Alert, Checkbox, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from 'axios';
import { URL_NEWPASSWORD } from "../../utils/Endpoint"; 
import { useNavigate } from "react-router-dom";

function ChangePassword() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (values) => {
        setLoading(true);
        const data = {
            token: localStorage.getItem("passToken"),
            password: values.password,
            confirmPassword: values.confirmPassword
        };
        console.log(data);
        axios
            .post(URL_NEWPASSWORD, data)
            .then((res) => {
                console.log("res", res);
                // localStorage.setItem("passToken", res?.data.token);
                // console.log("resToken:"+ res?.data.token);
                // localStorage.setItem("email", email);
                navigate("/signin");
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error:", err);
                if (err.response) {
                    setErrMsg(err.response.data.message); // Jika response ada
                } else {
                    setErrMsg("Terjadi kesalahan jaringan. Silakan coba lagi."); // Jika response tidak ada
                }
                setLoading(false);
            });
    };

    return (
        <>
            {errMsg !== "" && (
                <div style={{ padding: "20px" }}>
                    <Alert message={errMsg} type="error" />
                </div>
            )}
            <div className="flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg w-2/4">
                    <h1 className="text-2xl font-bold text-center" style={{ color: "#800000" }}>Masukkan Password Baru</h1>
                    <h3 className="text-center mb-6">
                        Silakan masukkan password baru yang ingin Anda <br /> gunakan. 
                    </h3>
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            name='password'
                            label='Password'
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password 
                            placeholder="Masukkan password Anda" 
                            size="large"
                            autoComplete="off"
                            style={{ background: "#F2E8C6" }}
                            />
                        </Form.Item>
        
                        <Form.Item
                            name='confirmPassword'
                            label='Confirm Password'
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Please confirm your password!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password 
                            placeholder="Konfirmasi password" 
                            size="large"
                            autoComplete="off"
                            style={{ background: "#F2E8C6" }}
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
                        <div className="justify-center flex">
                            <a href="/signin">Kembali ke login</a>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default ChangePassword;
