import { useState } from "react";
import { Input, Button, Form, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from 'axios';
import { URL_SIGNIN } from "../utils/Endpoint";
import { useNavigate } from "react-router-dom";

function Login() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (values) => {
        setLoading(true);
        const data = {
            email: values.email,
            password: values.password,
        };
        axios
            .post(URL_SIGNIN, data)
            .then((res) => {
                console.log("res", res);
                if (res.data.role !== "Admin") {
                    setErrMsg('Anda tidak memiliki akses ke dalam dashboard admin');
                } else {
                    navigate("/dashboard");
                }
                setLoading(false);
            })
            .catch((err) => {
                setErrMsg(err.response.data.message);
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
            <div className="flex items-center justify-center min-h-screen bg-gray-100" style={{ paddingTop: '10%' }}>
                <div className="bg-white p-8 rounded-lg max-w-md">
                    <h1 className="font-bold text-center mt-6" style={{ color: "#800000" }}>Login</h1>
                    <h3 className="text-2xl text-center mb-6">Masuk ke akun Anda untuk pengalaman belanja terbaik.</h3>
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Email"
                            name='email'
                            rules={[{ required: true, message: "Please input your Email!" }]}
                        >
                            <Input 
                                prefix={<UserOutlined />}
                                placeholder="Email"
                                size="large"
                                autoComplete="off"
                                style={{ background: "#F2E8C6" }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name='password'
                            rules={[{ required: true, message: "Please input your password!" }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Password"
                                size="large"
                                autoComplete="off"
                                style={{ background: "#F2E8C6" }}  
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                loading={loading}
                                size="large"
                                style={{ background: "#800000" }}
                            >
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default Login;
