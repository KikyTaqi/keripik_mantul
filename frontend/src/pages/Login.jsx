import { useState } from "react";
import { Input, Button, Form, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@antd-design/icons";
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
                // console.log('err', err.response.data.message);
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
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
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
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                loading={loading}
                                size="large"
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