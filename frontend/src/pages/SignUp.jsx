import React, { useState, useEffect } from "react";
import { Form, Input, Button, Alert, message } from "antd";
import axios from "axios";
import { URL_SIGNUP } from '../utils/Endpoint'; // Update ke endpoint signup
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const Signup = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const navigate = useNavigate(); // Hook untuk navigasi

    function getUserFromToken(localToken) {
        const token = localToken; // Ambil token dari localStorage
        if (!token) return null; // Jika token tidak ada
    
        try {
            const decoded = jwtDecode(token); // Decode token
            console.log("Decoded payload:", decoded);
            return decoded; // Kembalikan payload token
        } catch (err) {
            console.error("Invalid token", err);
            return null; // Jika token tidak valid
        }
    }

    // fn -> submit form
    const handleGoogleSuccess = async (credentialResponse) => {
        const { credential } = credentialResponse;

        try {
            const response = await axios.post(URL_SIGNUP+'/google', { token: credential });
            console.log(response.data);
            if(response.data.token != null){
                localStorage.setItem('userToken', response.data.token);
                const localToken = localStorage.getItem('userToken');
    
                const token = getUserFromToken(localToken);
                console.log("UserToken:", localStorage.getItem("userToken"));
                console.log("Token:", token);
                
                if (token.role != "Admin") { 
                    navigate("/");
                } else {
                    navigate("/dashboard");
                }
            }
            throw new Error("Failed to login");
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
            console.log("res", res);
            localStorage.setItem("passToken", res?.data.token);
            console.log("resToken:"+ res?.data.token);
            localStorage.setItem("email", email);
            navigate("/signup/confirm");
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
    const handleSubmit = async (values) => {
        setLoading(true);

        console.log('values', values);
        const data = {
            email: values.email,
            password: values.password,
        };
        console.log('Data', data);
        axios
        .post(URL_SIGNUP+"/confirm", data)
        .then((res) => {
            handleSendConfirm(res?.data.user);
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
            <h1 className="text-2xl font-bold text-center" style={{ color: "#800000" }}>Registrasi</h1>
            <h3 className="text-center mb-6">Buat akun dan mulai belanja sekarang !</h3>
            <Form 
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >

                <Form.Item
                    name='email'
                    label='Email'
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                >
                    <Input 
                    placeholder="Masukkan email Anda" 
                    size="large"
                    autoComplete="on"
                    style={{ background: "#F2E8C6" }}
                    />
                </Form.Item>

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
                        Register
                    </Button>
                    <h3 className="mt-2 text-center">Sudah punya akun? Login <a className="underline" href="/signin" style={{ color: "#800000" }}>disini.</a></h3>
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

export default Signup;
