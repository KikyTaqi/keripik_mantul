import { useState,useRef,useEffect } from "react";
import { Input, Button, Form, Alert, Checkbox, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from 'axios';
import { URL_SIGNIN, URL_VERIFYOTP } from "../utils/Endpoint"; 
import { useNavigate } from "react-router-dom";

function ConfirmAccount() {
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
    const ref4 = useRef(null);
    const inputRef = [ref1, ref2, ref3, ref4];
    const [isexpire, setIsExpire] = useState(false);
    const [otpTime, setOtpTime] = useState(null);
    const [otp1, setOtp1] = useState("");
    const [otp2, setOtp2] = useState("");
    const [otp3, setOtp3] = useState("");
    const [otp4, setOtp4] = useState("");

    const otpArray = [setOtp1, setOtp2, setOtp3, setOtp4];
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const navigate = useNavigate();

    const getTime = async () => {
        try {
            const data = {
                token: localStorage.getItem("passToken")
            };
            console.log(data);
            axios
                .post(URL_VERIFYOTP+"/time", data)
                .then((res) => {
                    console.log("res", res);
                    const remaningTime =
                        new Date(res.sendTime).getTime() - new Date().getTime();
            
                    if (remaningTime > 0) {
                        setOtpTime(remaningTime);
                    } else {
                        setIsExpire(true);
                    }
                })
                .catch((err) => {
                    console.error("Error:", err);
                    if (err.response) {
                        setErrMsg(err.response.data.message); // Jika response ada
                    } else {
                        setErrMsg("Terjadi kesalahan jaringan. Silakan coba lagi."); // Jika response tidak ada
                    }
                });
    
          
        } catch (error) {
        //   toast.error(error.message);
        }
      };

    useEffect(() => {
        if (ref1.current) {
            ref1.current.focus();
        }
        getTime();
    }, []);

    const inputChange = (event, location) => {
        if (location < inputRef.length - 1 && event.target.value) {
            inputRef[location + 1].current.focus();
        }
        otpArray[location](event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const finalOtp = otp1 + otp2 + otp3 + otp4;
        setLoading(true);
        const data = {
            otp: finalOtp,
        };
        console.log(data);
        axios
            .post(URL_VERIFYOTP, data)
            .then((res) => {
                console.log("res", res);
                localStorage.setItem("passToken", res?.data.token);
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
                        <Form.Item>
                            <div className="flex gap-2 justify-center rounded-lg p-2">
                                {inputRef.map((item, index) => {
                                    return (
                                        <input
                                            key={index}
                                            required
                                            onChange={(event) => inputChange(event, index)}
                                            ref={item}
                                            onInput={(event) => {
                                                if (event.target.value.length > 1) {
                                                    event.target.value = event.target.value.slice(0, 1);
                                                } else if (event.target.value.length < 1) {
                                                    if (index > 0) {
                                                        inputRef[index - 1].current.focus();
                                                    }
                                                }
                                            }}
                                            type="text"
                                            style={{ width: "52px", height: "55px", textAlign: "center", backgroundColor: "#F2E8C6", borderRadius: 15, outline: 0, marginLeft: 5, marginRight: 5 }}
                                        />
                                    );
                                })}
                            </div>
                        </Form.Item>

                        <Form.Item className="mb-1 text-center">
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                size="large"
                                className="rounded-full"
                                style={{ background: "#800000", width: "50%" }}
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

export default ConfirmAccount;
