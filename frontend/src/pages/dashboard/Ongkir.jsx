import React, { useState, useEffect } from "react";
import axios from 'axios';
import { URL_ONGKIR } from '../../utils/Endpoint';
import { FaCirclePlus, FaPencil, FaRegTrashCan } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import '../../style.css';
import {Button, Image, ConfigProvider } from 'antd';

const Ongkir = () => {
    const [ongkir, setOngkir] = useState([]);

    useEffect(() => {
        fetchOngkir()
    }, []);

    const fetchOngkir = async () => {
        try {
            const response = await axios.get(URL_ONGKIR);
            setOngkir(response.data);
            const filteredKategori = response.data.map(({__v, ...rest }) => rest);
            setOngkir(filteredKategori);
        } catch (error) {
            console.error("Error fetching kategori:", error);
        }
    };

    const handleEdit = (id) => {
        console.log(`Edit item with id: ${id}`);
        // Implement edit functionality
    };

    const handleDelete = (id) => {
        console.log(`Delete item with id: ${id}`);
        // Implement delete functionality
    };

    

    return (
        <div>
            <div className="flex justify-between">
                    <h1 className="font-bold mt-1">Daftar Ongkos Kirim Untuk Dikelola</h1>
                    
                    <div className="flex">
                        <Link to={'/dashboard/ongkir/create'}>
                            <Button type="secondary" className="bg-red-800 hover:bg-red-700 text-white font-semibold rounded-3xl h-6 py-4 justify-items-center text-base"><FaCirclePlus /><span className="mb-1">Tambah Ongkir</span></Button>
                        </Link>
                    </div>
                </div>
        <div style={{ display: "flex", justifyContent: "center", height: "100vh" }}>
            <Table
                headers={["NO", "Jarak Minimal (Km)", "Jarak Maksimal (Km)", "Ongkos Kirim", "Aksi"]}
                data={ongkir}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
        </div>
    );
};

const localeOngkir = (idx, cell) => {
    if(idx == 2){
        return "Rp " + cell;
    }else{
        return cell;
    }
}
const Table = ({ title, headers, data, onEdit, onDelete }) => (
    <div style={{ width: "90%", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", margin: "0 auto" }}>
            <thead>
                <tr>
                    {headers.map((header) => (
                        <th style={{ border: "1px solid #ddd", background: "#F2E8C6", padding: "8px" }} className="font-semibold" key={header}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>{index + 1}</td>
                        {Object.values(item).slice(1.0).map((cell, idx) => (
                            <td style={{ border: "1px solid #ddd", padding: "8px" }} key={idx}>{localeOngkir(idx, cell)}</td>
                        ))}
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        <Link to={`/dashboard/ongkir/${item?._id}`}>
                        <Button type="secondary" className="border-2 border-red-800 hover:border-red-600 hover:text-red-700 me-2">
                            <FaPencil />
                        </Button>
                    </Link>
                    <Button
                        type="secondary"
                        className="border-2 border-red-800 hover:border-red-600 hover:text-red-700"
                        onClick={() => {
                            console.log('id', item?._id);
                            axios
                                .delete(`${URL_ONGKIR}/${item?._id}`)
                                .then((res) => {
                                    console.log(res);
                                    window.location.reload();
                                })
                                .catch((err) => console.log('err', err));
                        }}
                    >
                        <FaRegTrashCan />
                    </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default Ongkir;
