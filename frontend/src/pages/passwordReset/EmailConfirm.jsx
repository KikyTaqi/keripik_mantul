import { useState } from "react";
import { Input, Button, Form, Alert, Checkbox, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from 'axios';
import { URL_EMAILSEND } from "../../utils/Endpoint"; 
import { useNavigate } from "react-router-dom";

function EmailConfirm() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (values) => {
        setLoading(true);
        const data = {
            email: values.email,
        };
        console.log(data);
        axios
            .post(URL_EMAILSEND, data)
            .then((res) => {
                console.log("res", res);
                localStorage.setItem("passToken", res?.data.token);
                navigate("/password/reset/code");
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error:", err);
                if (err.response) {
                    setErrMsg(err.response.data.message); // Jika response ada
                } else {
                    setErrMsg("Terjadi kesalahan jaringan. Silakasssn coba lagi."); // Jika response tidak ada
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
                    <h1 className="text-2xl font-bold text-center" style={{ color: "#800000" }}>Lupa Password?</h1>
                    <h3 className="text-center mb-6">
                        Masukkan alamat email Anda yang terdaftar, dan kami<br />akan mengirimkan tautan untuk mereset password.
                    </h3>
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
                                autoComplete="on"
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
                                Kirim Kode
                            </Button>
                        </Form.Item>
                        <div className="justify-center flex">
                            <a onClick={() => {navigate(-1)}}>Kembali ke login</a>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default EmailConfirm;
