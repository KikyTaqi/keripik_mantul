import React, { useState, useEffect } from "react";
import axios from 'axios';
import { URL_KATEGORI } from '../../utils/Endpoint';

const Kategori = () => {
    const [kategori, setKategori] = useState([]);

    useEffect(() => {
        fetchKategori()
    }, []);

    const fetchKategori = async () => {
        try {
            const response = await axios.get(URL_KATEGORI);
            setKategori(response.data);
            const filteredKategori = response.data.map(({ _id, ...rest }) => rest);
            setKategori(filteredKategori);
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
        <div style={{ display: "flex", justifyContent: "center", height: "100vh" }}>
            <Table
                title="Produk Kategori"
                headers={["NO", "Nama Kategori", "Aksi"]}
                data={kategori}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

const Table = ({ title, headers, data, onEdit, onDelete }) => (
    <div style={{ width: "60%", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
        <h3 className="font-bold mb-5">{title}</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", margin: "0 auto" }}>
            <thead>
                <tr>
                    {headers.map((header) => (
                        <th style={{ border: "1px solid #ddd", background: "#F2E8C6", padding: "8px" }} key={header}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>{index + 1}</td>
                        {Object.values(item).map((cell, idx) => (
                            <td style={{ border: "1px solid #ddd", padding: "8px" }} key={idx}>{cell}</td>
                        ))}
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <button onClick={() => onEdit(item.id)} style={{ marginRight: "8px" }}>Edit</button>
                            <button onClick={() => onDelete(item.id)}>Hapus</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default Kategori;
