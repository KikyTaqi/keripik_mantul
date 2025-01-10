import { useState } from "react";
import { Input, Button, Form, Alert, Checkbox, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from 'axios';
import { URL_SIGNIN } from "../../utils/Endpoint"; 
import { useNavigate } from "react-router-dom";

function ResetCode() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();

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
                if (res.data.role !== "Admin") {
                    navigate("/");
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
            <div className="flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg w-2/4">
                    <h1 className="text-2xl font-bold text-center" style={{ color: "#800000" }}>Dapatkan Kode Anda</h1>
                    <h3 className="text-center mb-6">
                    Kami telah mengirimkan kode verifikasi ke email Anda. <br /> Gunakan kode tersebut untuk melanjutkan ke langkah berikutnya
                    </h3>
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Code"
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
                                Verifikasi Kode
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

export default ResetCode;
