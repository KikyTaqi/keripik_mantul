import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { URL_SIGNUP } from '../utils/Endpoint'; // Update ke endpoint signup
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate(); // Hook untuk navigasi

    // fn -> submit form
    const handleSubmit = async (values) => {
        setLoading(true);

        console.log('values', values);
        try {
            await axios.post(URL_SIGNUP, values);
            message.success('Signup successful!');
            form.resetFields();
            navigate('/signin'); // Arahkan ke halaman login setelah signup
        } catch (error) {
            message.error("Failed to signup!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
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
                    autoComplete="off"
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
                        Login
                    </Button>
                    <h3 className="mt-2 text-center">Sudah punya akun? Login <a className="underline" href="/signup" style={{ color: "#800000" }}>disini.</a></h3>
                </Form.Item>
            </Form>
            </div>
            </div>
        </div>
    );
};

export default Signup;
