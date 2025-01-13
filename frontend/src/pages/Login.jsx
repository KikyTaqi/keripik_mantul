import { useState, useEffect } from "react";
import { Input, Button, Form, Alert, Checkbox, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { GoogleOAuthProvider,GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { URL_SIGNIN, URL_SIGNUP } from "../utils/Endpoint";
import { useNavigate } from "react-router-dom";

function Login() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse) => {
        const { credential } = credentialResponse;

        try {
            const res = await axios.post(URL_SIGNIN+'/google', { token: credential });
            console.log("Res log google: "+res.data.role);
            localStorage.setItem('userToken', res.data.token);
            localStorage.setItem('userEmail', res.data.email);
            localStorage.setItem('userRole', res.data.role);

            const userToken = localStorage.getItem('userToken');
            const userEmail = localStorage.getItem('userEmail');
            const userRole = localStorage.getItem('userRole');
            console.log("HMHMHM: "+userToken + userEmail + userRole);
            if (res.data.role !== "Admin") {
                navigate("/");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            console.error(error);
        }
    };
    const handleGoogleFailure = () => {
        alert('Google Sign-In Failed');
    };

    const handleSendConfirm = async (user) => {
        console.log(user);  
        const data = {
            email: user.email,
            otp: user.otp.otp,
            token: user.otp.token
        }
        axios
        .post(URL_SIGNUP+"/confirm/send", data)
        .then((res) => {
            localStorage.setItem("passToken", res?.data.token);
            navigate("/password/reset/code");
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
    }

    const handleSubmit = (values) => {
        setLoading(true);
        const data = {
            email: values.email,
            password: values.password,
            rememberMe: rememberMe,
        };
        console.log(values.password);
        console.log(values.email);
        axios
            .post(URL_SIGNIN, data)
            .then((res) => {
                console.log("res", res);
                localStorage.setItem('userToken', res.data.token);
                localStorage.setItem('userEmail', res.data.email);
                localStorage.setItem('userRole', res.data.role);
                if (res.data.role !== "Admin") {
                    navigate("/");
                } else {
                    navigate("/dashboard");
                }
                setLoading(false);
            })
            .catch((err) => {
                if(err.response.data.reg === true){
                    const user = {
                        email: values.email,
                        otp: {
                            otp: "",
                            token: ""
                        }
                    }
                    handleSendConfirm(user);
                    navigate("/signup/confirm");
                }
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
            <div className="flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg w-2/4">
                    <h1 className="text-2xl font-bold text-center" style={{ color: "#800000" }}>Login</h1>
                    <h3 className="text-center mb-6">Masuk ke akun Anda untuk pengalaman belanja terbaik.</h3>
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
                                placeholder="Masukkan email Anda"
                                size="large"
                                autoComplete="off"
                                style={{ background: "#F2E8C6" }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name='password'
                            className="mb-1"
                        >
                            <Input.Password
                                placeholder="Masukkan password Anda"
                                size="large"
                                autoComplete="off"
                                style={{ background: "#F2E8C6" }}  
                            />
                        </Form.Item>
                            <div className="flex justify-between mb-7">
                                <Checkbox
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                >
                                    Remember me
                                </Checkbox>
                                <a href="/password/reset">
                                    Lupa Password?
                                </a>
                            </div>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                loading={loading}
                                size="large"
                                className="rounded-full"
                                style={{ background: "#800000" }}
                            >
                                Login
                            </Button>
                            <h3 className="mt-2 text-center">Belum punya akun? Buat <a className="underline" href="/signup" style={{ color: "#800000" }}>disini.</a></h3>
                        </Form.Item>
                    </Form>
                    <GoogleOAuthProvider clientId="853769351673-tv8qth8b3g3of3r046nni0obf0hklcpg.apps.googleusercontent.com">
                        <div>
                            <GoogleLogin 
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleFailure}
                            />
                        </div>
                    </GoogleOAuthProvider>
                </div>
            </div>
        </>
    );
};

export default Login;
