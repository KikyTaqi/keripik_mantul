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
            <h1>Signup</h1>
            <Form 
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name='name'
                    label='Full Name'
                    rules={[{ required: true, message: 'Please input your full name!' }]}
                >
                    <Input placeholder="Enter your full name" />
                </Form.Item>

                <Form.Item
                    name='email'
                    label='Email'
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                >
                    <Input placeholder="Enter your email" />
                </Form.Item>

                <Form.Item
                    name='password'
                    label='Password'
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password placeholder="Enter your password" />
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
                    <Input.Password placeholder="Confirm your password" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Sign Up
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Signup;
