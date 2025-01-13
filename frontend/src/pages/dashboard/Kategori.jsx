import React, { useState, useEffect } from "react";
import axios from 'axios';
import { URL_KATEGORI } from '../../utils/Endpoint';

const Kategori = () => {
    const [kategori, setKategori] = useState([]);

    useEffect(() => {
        fetchKategori()
    }, []);

    const fetchKategori = async () => {
        const response = await axios.get(URL_KATEGORI);
        setKategori(response.data);
    };

    return(
    <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Table title="Produk Kategori" headers={["NO", "Nama Kategori"]} data={kategori} />
        </div>
    );
};

const Table = ({ title, headers, data }) => (
    <div style={{ width: "48%", backgroundColor: "#fff", padding: "20px", borderRadius: "10px" }}>
        <h3 className="font-bold mb-5">{title}</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default Kategori;